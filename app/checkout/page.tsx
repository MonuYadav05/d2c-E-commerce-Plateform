"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Check, Truck, Home, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { formatter, getImageUrl } from "@/lib/utils";

type Address = {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  isDefault: boolean;
};

const paymentMethods = [
  { id: "credit-card", name: "Credit / Debit Card", icon: CreditCard },
  { id: "cod", name: "Cash on Delivery", icon: Home },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Form state for new address
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    isDefault: false,
  });

  // Calculate order summary values
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const discount = 0; // Implement promo code logic if needed
  const tax = (subtotal - discount) * 0.05; // 5% tax
  const total = subtotal - discount + tax + deliveryFee;

  // Mock fetching addresses
  const fetchAddresses = async () => {

    try {
      const response = await fetch("api/address");
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      setAddresses(data);

      setSelectedAddressId("addr1");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch addresses. Please try again.",
      });
    }
  };

  // Handle input change for new address
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle adding new address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newAddress.fullName || !newAddress.addressLine1 || !newAddress.city ||
      !newAddress.state || !newAddress.postalCode || !newAddress.phoneNumber) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const response = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to add address");
    }

    toast({
      variant: "destructive",
      title: "falied",
      description: "Failed to add address",
    });
    console.log(data);
    setAddresses([...addresses, data]);
    setSelectedAddressId(data.id);

    // Reset form
    setNewAddress({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      isDefault: false,
    });

    toast({
      title: "Address added",
      description: "Your new address has been saved.",
    });
  };

  // Handle order placement
  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast({
        variant: "destructive",
        title: "No address selected",
        description: "Please select a delivery address.",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "No payment method selected",
        description: "Please select a payment method.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod,
          promoCode: "", // pass actual promo code if used
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order placement failed");
      }

      // Navigate to confirmation page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize checkout
  useState(() => {
    fetchAddresses();
  });

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : 1}
              </div>
              <span className={`text-sm mt-1 ${step >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>Address</span>
            </div>
            <div className="grow border-t border-border mt-4 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : 2}
              </div>
              <span className={`text-sm mt-1 ${step >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>Payment</span>
            </div>
            <div className="grow border-t border-border mt-4 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className={`text-sm mt-1 ${step >= 3 ? 'font-medium' : 'text-muted-foreground'}`}>Review</span>
            </div>
          </div>

          {/* Step 1: Delivery Address */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium">Saved Addresses</h3>
                  {addresses.map(address => (
                    <Card
                      key={address.id}
                      className={`border-2 cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-primary' : 'border-border'
                        }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{address.fullName}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {address.addressLine1}
                              {address.addressLine2 && <>, {address.addressLine2}</>}
                              <br />
                              {address.city}, {address.state} {address.postalCode}
                              <br />
                              {address.phoneNumber}
                            </div>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Address */}
              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="new-address">
                  <AccordionTrigger className="text-sm font-medium">
                    Add New Address
                  </AccordionTrigger>
                  <AccordionContent>
                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName">Full Name*</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="addressLine1">Address Line 1*</Label>
                        <Input
                          id="addressLine1"
                          name="addressLine1"
                          value={newAddress.addressLine1}
                          onChange={handleInputChange}
                          placeholder="Street address, apartment, etc."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input
                          id="addressLine2"
                          name="addressLine2"
                          value={newAddress.addressLine2}
                          onChange={handleInputChange}
                          placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City*</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleInputChange}
                          placeholder="Mumbai"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State*</Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleInputChange}
                          placeholder="Maharashtra"
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Postal Code*</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={newAddress.postalCode}
                          onChange={handleInputChange}
                          placeholder="400001"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phoneNumber">Phone Number*</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={newAddress.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="isDefault" className="text-sm cursor-pointer">
                          Set as default address
                        </Label>
                      </div>

                      <div className="md:col-span-2">
                        <Button type="submit">
                          Save Address
                        </Button>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                className="w-full sm:w-auto"
                disabled={!selectedAddressId}
                onClick={() => setStep(2)}
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="space-y-4 mb-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <Card
                        key={method.id}
                        className={`border-2 cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary' : 'border-border'
                          }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <Label htmlFor={method.id} className="cursor-pointer">{method.name}</Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="bg-muted p-6 rounded-lg mt-4">
                    <p className="text-center text-muted-foreground mb-4">
                      This is a mock checkout. In a real application, a secure payment form would be displayed here.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="•••• •••• •••• ••••"
                          value="4111 1111 1111 1111"
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value="12/25" disabled />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value="123" disabled />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value="John Doe"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue to Review
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">Review Order</h2>

              {/* Delivery Details */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
                <Card>
                  <CardContent className="p-4 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      {selectedAddress ? (
                        <div className="text-sm">
                          <div className="font-medium">{selectedAddress.fullName}</div>
                          <div className="text-muted-foreground">
                            {selectedAddress.addressLine1}
                            {selectedAddress.addressLine2 && <>, {selectedAddress.addressLine2}</>}
                            <br />
                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                            <br />
                            {selectedAddress.phoneNumber}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No address selected</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    {paymentMethod === "credit-card" ? (
                      <>
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div className="text-sm">
                          <div className="font-medium">Credit / Debit Card</div>
                          <div className="text-muted-foreground">**** **** **** 1111</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Home className="h-5 w-5 text-primary" />
                        <div className="text-sm">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-muted-foreground">Pay when you receive your order</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Items ({items.length})</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {items.slice(0, 3).map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                            <img
                              src={getImageUrl(item.product.images)}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <div className="text-xs text-muted-foreground">
                              Quantity: {item.quantity}
                            </div>
                            <div className="text-sm font-medium">
                              {formatter.format(item.quantity * item.product.price * (1 - (item.product.discount || 0)))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {items.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          + {items.length - 3} more item(s)
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="gap-2"
                  onClick={placeOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>Place Order</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span>{formatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>{formatter.format(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>{formatter.format(deliveryFee)}</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>{formatter.format(total)}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4" />
                <span>Estimated delivery: 10-30 minutes after placing order</span>
              </div>

              <p>
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}