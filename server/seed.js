const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Children', 'Education', 'Business', 'Philosophy'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding');
    
    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');
    
    // Generate Users
    const usersData = [];
    usersData.push({
      name: 'Admin User',
      email: 'admin@bookstore.com',
      password: 'admin123',
      role: 'admin'
    });
    
    for(let i=1; i<=75; i++) {
       usersData.push({
         name: `User ${i}`,
         email: `user${i}@example.com`,
         password: 'user123',
         role: 'user'
       });
    }
    
    const createdUsers = [];
    for(let u of usersData) {
        // use create to trigger pre-save password hash
        const user = await User.create(u);
        createdUsers.push(user);
    }
    console.log(`✅ Seeded ${createdUsers.length} users (including 1 admin).`);

    // Generate Books
    const books = [];
    for(let i=1; i<=100; i++) {
        books.push({
           title: `Sample Book Title ${i}`,
           author: `Author ${Math.floor(Math.random() * 20) + 1}`,
           description: `This is the description for Sample Book Title ${i}. It provides an interesting narrative and insightful reading experience.`,
           price: Math.floor(Math.random() * 900) + 100, // Price between 100 and 1000
           category: categories[Math.floor(Math.random() * categories.length)],
           stock: Math.floor(Math.random() * 100) + 10,
           image: `https://loremflickr.com/320/480/book?random=${i}`,
           rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
           totalSold: Math.floor(Math.random() * 50)
        });
    }
    const createdBooks = await Book.insertMany(books);
    console.log(`✅ Seeded ${createdBooks.length} books.`);

    // Generate Orders
    const orders = [];
    const normalUsers = createdUsers.filter(u => u.role === 'user');
    
    for(let i=1; i<=120; i++) {
        const user = normalUsers[Math.floor(Math.random() * normalUsers.length)];
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalAmount = 0;
        
        for(let j=0; j<numItems; j++) {
            const book = createdBooks[Math.floor(Math.random() * createdBooks.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            items.push({
                book: book._id,
                title: book.title,
                author: book.author,
                image: book.image,
                quantity,
                price: book.price
            });
            totalAmount += (book.price * quantity);
        }
        
        let statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        orders.push({
            user: user._id,
            userName: user.name,
            userEmail: user.email,
            items,
            totalAmount,
            address: {
                street: `Street ${Math.floor(Math.random() * 100)}`,
                city: 'Sample City',
                state: 'Sample State',
                zipCode: `1000${Math.floor(Math.random() * 99)}`,
                country: 'India'
            },
            status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
            paymentMethod: 'COD',
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // random date in past few months
        });
    }
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Seeded ${createdOrders.length} orders.`);
    
    console.log('\n🎉 Database Seeding Completed Successfully!');
    console.log('👤 Admin: admin@bookstore.com / admin123');
    console.log('👤 User: user1@example.com / user123');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
