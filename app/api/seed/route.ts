import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/mock-data'

export async function GET () {
  try {
    await seedDatabase()
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed database' },
      { status: 300 }
    )
  } finally {
    console.log('found request')
  }
}
