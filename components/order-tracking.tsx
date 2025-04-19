"use client";

import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED";

const statusSteps = [
  { status: "CONFIRMED", icon: Clock, label: "Order Confirmed" },
  { status: "PREPARING", icon: Package, label: "Preparing Order" },
  { status: "OUT_FOR_DELIVERY", icon: Truck, label: "Out for Delivery" },
  { status: "DELIVERED", icon: CheckCircle, label: "Delivered" },
];

export const OrderTracking = ({ status }: { status: OrderStatus }) => {
  const currentStep = statusSteps.findIndex(step => step.status === status);

  return (
    <div className="py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isActive = index === currentStep;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                  } ${isActive ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span className={`mt-2 text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};