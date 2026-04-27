import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create dealer user
  const dealerPassword = await bcrypt.hash('dealer123', 10)
  const dealer = await prisma.user.upsert({
    where: { email: 'dealer@autoshield.com' },
    update: {},
    create: {
      name: 'AutoShield Motors',
      email: 'dealer@autoshield.com',
      password: dealerPassword,
      phone: '(555) 123-4567',
      role: 'DEALER',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'john@example.com',
      password: userPassword,
      phone: '(555) 987-6543',
      role: 'USER',
    },
  })

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@autoshield.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@autoshield.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Users created')

  // Create cars
  const carsData = [
    {
      make: 'Toyota', model: 'Camry', year: 2023, price: 28500, mileage: 12000,
      color: 'Midnight Black', vin: 'JT2BF28K1W0012345', description: 'Sleek and reliable 2023 Toyota Camry with all the modern features you need. Low mileage, excellent condition. Features Apple CarPlay, Android Auto, and advanced safety systems.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'Sedan',
      images: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800']),
    },
    {
      make: 'Honda', model: 'CR-V', year: 2024, price: 35200, mileage: 5000,
      color: 'Sonic Gray Pearl', vin: 'JHLRD68504C012346', description: 'Near-new 2024 Honda CR-V Hybrid with outstanding fuel efficiency. Perfect family SUV with ample cargo space and cutting-edge technology.',
      condition: 'CERTIFIED', transmission: 'CVT', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800', 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800']),
    },
    {
      make: 'Ford', model: 'F-150', year: 2022, price: 45000, mileage: 28000,
      color: 'Race Red', vin: '1FTFW1ET0NFA12347', description: 'Powerful 2022 Ford F-150 with towing package. Crew cab, 4WD, and all the features for work or play. Well-maintained with service records.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'Truck',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
    },
    {
      make: 'BMW', model: '3 Series', year: 2023, price: 52000, mileage: 8000,
      color: 'Alpine White', vin: 'WBA5E7C50JA12348', description: 'Stunning 2023 BMW 3 Series with premium package. Sport seats, Harman Kardon audio, and BMW ConnectedDrive. The ultimate driving machine.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'Sedan',
      images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800']),
    },
    {
      make: 'Tesla', model: 'Model 3', year: 2024, price: 42990, mileage: 3000,
      color: 'Pearl White', vin: '5YJ3E1EA1NF012349', description: 'Near-new Tesla Model 3 Long Range AWD. Full self-driving capability hardware, over-the-air updates, and access to the Supercharger network.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Electric', bodyType: 'Sedan',
      images: JSON.stringify(['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'https://images.unsplash.com/photo-1571127236794-81c1e8f6f4b4?w=800']),
    },
    {
      make: 'Chevrolet', model: 'Tahoe', year: 2023, price: 58000, mileage: 15000,
      color: 'Summit White', vin: '1GNSKCKC4PR012350', description: 'Spacious 2023 Chevrolet Tahoe Z71 4WD. Seating for 9, premium Bose audio, and magnetic ride control. Perfect for large families.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800']),
    },
    {
      make: 'Hyundai', model: 'Tucson', year: 2024, price: 29500, mileage: 2000,
      color: 'Shimmering Silver', vin: '5NMJF3AE1NH012351', description: 'Brand new 2024 Hyundai Tucson Hybrid with BlueLink connected services. Panoramic sunroof, wireless charging, and Hyundai\'s 5-year warranty.',
      condition: 'NEW', transmission: 'Automatic', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', 'https://images.unsplash.com/photo-1574023278890-fce00f2e0c16?w=800']),
    },
    {
      make: 'Mercedes-Benz', model: 'GLE', year: 2022, price: 68500, mileage: 22000,
      color: 'Obsidian Black', vin: 'WDC0G8EB0NF012352', description: 'Luxurious 2022 Mercedes-Benz GLE 350 4MATIC. Burmester surround sound, MBUX infotainment, and all-wheel drive. Refined performance meets everyday practicality.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=800']),
    },
    {
      make: 'Volkswagen', model: 'Jetta', year: 2023, price: 22500, mileage: 18000,
      color: 'Tornado Red', vin: '3VWN57BU1LM012353', description: 'Sporty 2023 Volkswagen Jetta GLI with 2.0T engine. Digital cockpit, 8-inch touchscreen, and VW Car-Net. Great balance of performance and efficiency.',
      condition: 'USED', transmission: 'Manual', fuelType: 'Gasoline', bodyType: 'Sedan',
      images: JSON.stringify(['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800', 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800']),
    },
    {
      make: 'Audi', model: 'Q5', year: 2023, price: 49800, mileage: 9500,
      color: 'Navarra Blue', vin: 'WA1BNAFY4J2012354', description: 'Premium 2023 Audi Q5 quattro with S line package. Virtual cockpit, MMI navigation plus, and Bang & Olufsen sound system. German engineering at its finest.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800']),
    },
    {
      make: 'Subaru', model: 'Outback', year: 2023, price: 32000, mileage: 14000,
      color: 'Geyser Blue', vin: '4S4BSACC1N3012355', description: 'Adventure-ready 2023 Subaru Outback Wilderness Edition. Symmetrical AWD, 9.5 inches of ground clearance, and X-Mode for tough terrain.',
      condition: 'USED', transmission: 'CVT', fuelType: 'Gasoline', bodyType: 'Wagon',
      images: JSON.stringify(['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=800']),
    },
    {
      make: 'Nissan', model: 'Altima', year: 2022, price: 24800, mileage: 31000,
      color: 'Deep Blue Pearl', vin: '1N4BL4DV0NN012356', description: 'Reliable 2022 Nissan Altima SV with AWD. ProPilot Assist, 8-inch touchscreen with wireless Apple CarPlay. Great commuter car with excellent safety ratings.',
      condition: 'USED', transmission: 'CVT', fuelType: 'Gasoline', bodyType: 'Sedan',
      images: JSON.stringify(['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800']),
    },
    {
      make: 'Jeep', model: 'Wrangler', year: 2024, price: 48500, mileage: 1200,
      color: 'Firecracker Red', vin: '1C4HJXDG5NW012357', description: 'Brand new 2024 Jeep Wrangler Rubicon 4xe Plug-in Hybrid. Removable doors and roof, 470 lb-ft torque, and up to 25 miles of electric range.',
      condition: 'NEW', transmission: 'Automatic', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800']),
    },
    {
      make: 'Porsche', model: 'Cayenne', year: 2022, price: 89000, mileage: 18500,
      color: 'Carrara White Metallic', vin: 'WP1AA2AY4NDA12358', description: 'Exceptional 2022 Porsche Cayenne S. Sport Chrono Package, PASM sport suspension, and panoramic roof system. Combine sports car performance with SUV versatility.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800']),
    },
    {
      make: 'Kia', model: 'Telluride', year: 2023, price: 38500, mileage: 11000,
      color: 'Gravity Gray', vin: '5XYP64HC0NG012359', description: 'Award-winning 2023 Kia Telluride SX-Prestige. 3-row SUV with Nappa leather, 10.25-inch panoramic display, and Kia\'s 10-year/100,000-mile powertrain warranty.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800', 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800']),
    },
    {
      make: 'Mazda', model: 'CX-5', year: 2024, price: 31000, mileage: 4500,
      color: 'Soul Red Crystal', vin: 'JM3KFBDM4N0012360', description: 'Gorgeous 2024 Mazda CX-5 Turbo Premium. Unique Soul Red Crystal exterior, Bose 12-speaker audio, and available i-ACTIV AWD. KODO design at its best.',
      condition: 'NEW', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', 'https://images.unsplash.com/photo-1574023278890-fce00f2e0c16?w=800']),
    },
    {
      make: 'Lexus', model: 'RX', year: 2023, price: 56000, mileage: 13000,
      color: 'Cloudburst Gray', vin: '2T2BZMCA5NC012361', description: 'Sophisticated 2023 Lexus RX 500h F SPORT Performance. New turbocharged 2.4L hybrid powertrain, 14.4-inch touchscreen, and Mark Levinson audio. Redefined luxury.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=800', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800']),
    },
    {
      make: 'Ram', model: '1500', year: 2023, price: 52500, mileage: 9800,
      color: 'Bright Silver', vin: '1C6SRFFT4NN012362', description: 'Premium 2023 Ram 1500 Longhorn 4x4. Best-in-class interior with real wood trim, 12-inch Uconnect touchscreen, and available air suspension. Redefining trucks.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Gasoline', bodyType: 'Truck',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
    },
    {
      make: 'Volvo', model: 'XC90', year: 2022, price: 62000, mileage: 24000,
      color: 'Crystal White Pearl', vin: 'YV4A22PK5N1012363', description: 'Safe and stylish 2022 Volvo XC90 Recharge T8. Plug-in hybrid with 18-mile electric range, Bowers & Wilkins audio, and Volvo\'s legendary safety features.',
      condition: 'CERTIFIED', transmission: 'Automatic', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800']),
    },
    {
      make: 'Toyota', model: 'RAV4', year: 2023, price: 33500, mileage: 16000,
      color: 'Silver Sky Metallic', vin: 'JTMRWRFV0ND012364', description: 'Popular 2023 Toyota RAV4 Prime XSE. Plug-in hybrid with 42-mile electric range, 302 combined system horsepower, and Toyota Safety Sense 2.5+.',
      condition: 'USED', transmission: 'Automatic', fuelType: 'Hybrid', bodyType: 'SUV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800']),
    },
  ]

  for (const car of carsData) {
    await prisma.car.upsert({
      where: { vin: car.vin },
      update: {},
      create: { ...car, dealerId: dealer.id },
    })
  }

  console.log('✅ Cars created')

  // Create insurance providers
  const providers = [
    {
      id: 'provider-1',
      name: 'Shield Insurance Co.',
      logo: 'SI',
      description: 'Top-rated auto insurance with 50+ years of trusted coverage and exceptional customer service.',
      rating: 4.8,
    },
    {
      id: 'provider-2',
      name: 'DriveGuard Pro',
      logo: 'DG',
      description: 'Technology-driven insurance solutions with real-time monitoring and instant claims processing.',
      rating: 4.6,
    },
    {
      id: 'provider-3',
      name: 'AutoSecure Plus',
      logo: 'AS',
      description: 'Affordable comprehensive coverage with flexible payment options and 24/7 roadside assistance.',
      rating: 4.5,
    },
  ]

  for (const provider of providers) {
    await prisma.insuranceProvider.upsert({
      where: { id: provider.id },
      update: {},
      create: provider,
    })
  }

  // Create insurance plans
  const plans = [
    // Shield Insurance Plans
    {
      id: 'plan-1', providerId: 'provider-1', name: 'Basic Shield', type: 'LIABILITY',
      monthlyPremium: 45, deductible: 1000, coverageLimit: 50000,
      features: JSON.stringify(['Bodily injury liability', 'Property damage liability', '24/7 claims support', 'Roadside assistance']),
    },
    {
      id: 'plan-2', providerId: 'provider-1', name: 'Comprehensive Shield', type: 'COMPREHENSIVE',
      monthlyPremium: 85, deductible: 750, coverageLimit: 150000,
      features: JSON.stringify(['All Basic Shield features', 'Comprehensive coverage', 'Collision coverage', 'Uninsured motorist', 'Rental reimbursement']),
    },
    {
      id: 'plan-3', providerId: 'provider-1', name: 'Elite Shield', type: 'FULL_COVERAGE',
      monthlyPremium: 135, deductible: 500, coverageLimit: 500000,
      features: JSON.stringify(['All Comprehensive Shield features', 'New car replacement', 'Gap insurance', 'Medical payments', 'Custom parts coverage', 'Accident forgiveness']),
    },
    {
      id: 'plan-4', providerId: 'provider-1', name: 'Collision Shield', type: 'COLLISION',
      monthlyPremium: 65, deductible: 800, coverageLimit: 100000,
      features: JSON.stringify(['Collision damage coverage', 'Hit-and-run protection', 'Single car accident coverage', 'Rental car coverage']),
    },
    {
      id: 'plan-5', providerId: 'provider-1', name: 'Business Fleet Shield', type: 'FULL_COVERAGE',
      monthlyPremium: 165, deductible: 400, coverageLimit: 750000,
      features: JSON.stringify(['Commercial use coverage', 'Fleet discount', 'Driver monitoring', 'Cargo coverage', 'Employee injury coverage']),
    },
    // DriveGuard Plans
    {
      id: 'plan-6', providerId: 'provider-2', name: 'SmartDrive Basic', type: 'LIABILITY',
      monthlyPremium: 39, deductible: 1200, coverageLimit: 50000,
      features: JSON.stringify(['Telematics discount', 'Safe driver rewards', 'Digital ID cards', 'Mobile app claims']),
    },
    {
      id: 'plan-7', providerId: 'provider-2', name: 'SmartDrive Plus', type: 'COMPREHENSIVE',
      monthlyPremium: 79, deductible: 600, coverageLimit: 200000,
      features: JSON.stringify(['All SmartDrive Basic features', 'Comprehensive coverage', 'Real-time driver feedback', 'Instant claims approval', 'EV charging coverage']),
    },
    {
      id: 'plan-8', providerId: 'provider-2', name: 'SmartDrive Premium', type: 'FULL_COVERAGE',
      monthlyPremium: 125, deductible: 350, coverageLimit: 500000,
      features: JSON.stringify(['All SmartDrive Plus features', 'Zero deductible option', 'Nationwide network repair', 'OEM parts guarantee', 'Lifetime rate lock']),
    },
    {
      id: 'plan-9', providerId: 'provider-2', name: 'EV Specialist Plan', type: 'FULL_COVERAGE',
      monthlyPremium: 110, deductible: 500, coverageLimit: 400000,
      features: JSON.stringify(['Battery coverage', 'Charging equipment coverage', 'EV-specialist repair network', 'Range anxiety protection', 'Cyber security coverage']),
    },
    {
      id: 'plan-10', providerId: 'provider-2', name: 'Young Driver Safe', type: 'COLLISION',
      monthlyPremium: 95, deductible: 800, coverageLimit: 150000,
      features: JSON.stringify(['Young driver discount', 'Good student discount', 'Defensive driving course credit', 'Graduated licensing support']),
    },
    // AutoSecure Plans
    {
      id: 'plan-11', providerId: 'provider-3', name: 'Value Protect', type: 'LIABILITY',
      monthlyPremium: 35, deductible: 1500, coverageLimit: 50000,
      features: JSON.stringify(['State minimum coverage', 'Flexible monthly payments', 'No cancellation fees', 'SR-22 filing available']),
    },
    {
      id: 'plan-12', providerId: 'provider-3', name: 'Family Protect', type: 'COMPREHENSIVE',
      monthlyPremium: 75, deductible: 700, coverageLimit: 175000,
      features: JSON.stringify(['Multi-car discount', 'Homeowner discount', 'Bundling savings', 'Child safety seat coverage', 'Pet injury protection']),
    },
    {
      id: 'plan-13', providerId: 'provider-3', name: 'Total Protect', type: 'FULL_COVERAGE',
      monthlyPremium: 120, deductible: 500, coverageLimit: 450000,
      features: JSON.stringify(['All Family Protect features', 'Rideshare coverage', 'Vanishing deductible', 'Better car replacement', '24/7 concierge service']),
    },
    {
      id: 'plan-14', providerId: 'provider-3', name: 'Truck & SUV Guard', type: 'FULL_COVERAGE',
      monthlyPremium: 140, deductible: 600, coverageLimit: 500000,
      features: JSON.stringify(['Off-road coverage', 'Truck bed coverage', 'Equipment endorsement', 'Towing package coverage', 'Commercial use option']),
    },
    {
      id: 'plan-15', providerId: 'provider-3', name: 'Senior Saver', type: 'COMPREHENSIVE',
      monthlyPremium: 62, deductible: 750, coverageLimit: 200000,
      features: JSON.stringify(['Senior driver discount', 'Mature driver course credit', 'Low mileage discount', 'Hospital income benefit', 'Medical expenses coverage']),
    },
  ]

  for (const plan of plans) {
    await prisma.insurancePlan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    })
  }

  console.log('✅ Insurance providers and plans created')

  // Create a sample policy for the demo user
  const cars = await prisma.car.findMany({ take: 2 })
  if (cars.length >= 1) {
    await prisma.policy.upsert({
      where: { policyNumber: 'AS-2024-001234' },
      update: {},
      create: {
        userId: user.id,
        carId: cars[0].id,
        planId: 'plan-3',
        policyNumber: 'AS-2024-001234',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-15'),
        monthlyPremium: 135,
      },
    })

    // Save a car for the user
    await prisma.savedCar.upsert({
      where: { userId_carId: { userId: user.id, carId: cars[0].id } },
      update: {},
      create: { userId: user.id, carId: cars[0].id },
    })

    if (cars.length >= 2) {
      await prisma.savedCar.upsert({
        where: { userId_carId: { userId: user.id, carId: cars[1].id } },
        update: {},
        create: { userId: user.id, carId: cars[1].id },
      })
    }
  }

  console.log('✅ Sample data created')
  console.log('')
  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('Test accounts:')
  console.log('  User:   john@example.com / user123')
  console.log('  Dealer: dealer@autoshield.com / dealer123')
  console.log('  Admin:  admin@autoshield.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
