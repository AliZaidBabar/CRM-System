import express from "express";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import bcrypt from "bcrypt";
import { UserModel, ProductModel } from "./models/User.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import fileUpload from 'express-fileupload';


const app = express()
app.use(express.json())
app.use(cors({
    origin: "*", // Replace with the correct frontend URL
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true
}))
app.use(fileUpload())
mongoose.connect('mongodb://127.0.0.1/employ');



// Middleware to verify JWT token
// export async function verifyUser(req, res, next) {
//     try {
//         const { email } = req.method == "GET" ? req.query : req.body;

//         // check the user existence
//         let user = await UserModel.findOne({ email });
//         if (!user) return res.status(404).send({ error: "Can't find User!" });

//         // Attach the entire user object to the request object
//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(404).send({ error: "Authentication Error" });
//     }
// }
const secretKey = 'a730de481aabb8d381c5bd6a6b91ff85170c5854b709ca40a9aa44f88696a817';

function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split(' ')[1];
        console.log('Received token:', token); // Add this line

        try {
            const decodedToken = jwt.verify(token, secretKey);
            console.log('Decoded token:', decodedToken); // Add this line

            req.decodedToken = decodedToken;
            next(); // Move to the next middleware
        } catch (error) {
            console.log('Error verifying token:', error); // Add this line
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// app.post('/register',(req,res)=>{
//   UserModel.create(req.body)
//   .then(employ=>res.json(employ))
//   .catch(err=>res.json(err))
// })





// app.post('/login', (req, res) => {
//     const {email, password} = req.body;
//     UserModel.findOne({email: email})
//     .then(user => {
//         if(user) {
//             bcrypt.compare(password, user.password, (err, response) => {
//                 if(response) {
//                   const token = jwt.sign({email: user.email, role: user.role},
//                         "jwt-secret-key", {expiresIn: '1d'})  
//                     res.cookie('token', token)
//                     return res.json({Status: "Success", role: user.role})
//                 }else {
//                     return res.json("The password is incorrect")
//                 }
//             })
//         } else {
//             return res.json("No record existed")
//         }
//     })
// })

const adminEmails = ['alizaid@gmail.com', 'admin@example.com'];

app.post('/register', async (req, res) => {
    try {
        const { email, password, address, content } = req.body;
        let pic = null;

        if (req.files && req.files.pic) {
            pic = req.files.pic.data;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = adminEmails.includes(email); // Check if the email is in the adminEmails list
        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            address,
            pic,
            content,
            role: isAdmin ? 'admin' : 'visitor', // Assign "admin" role if email is in adminEmails list
        });

        res.json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     UserModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 // Perform your authentication logic here without bcrypt and jwt
//                 // For example, you can compare passwords directly if stored in plain text.
//                 // Replace this with your authentication logic.

//                 // Sample authentication logic (don't use plain text passwords in production):
//                 if (password === user.password) {
//                     return res.json({ Status: "Success", role: user.role, email: user.email });
//                 } else {
//                     return res.json("The password is incorrect");
//                 }
//             } else {
//                 return res.json("No record existed");
//             }
//         })
//         .catch(error => {
//             console.error("Database error:", error);
//             return res.status(500).json({ status: "Error", message: "Internal server error" });
//         });
// });



// app.get('/user/:email', (req, res) => {

//     const email = req.params.email;
//     UserModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 res.json(user);
//             } else {
//                 res.status(404).json({ message: "User not found" });
//             }
//         })
//         .catch(error => {
//             console.error("Database error:", error);
//             res.status(500).json({ message: "Internal server error" });
//         });
// });


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (passwordsMatch) {
                const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '365d' }); // Set expiresIn to a year
                return res.json({ Status: "Success", role: user.role, email: user.email, token: token });
            } else {
                return res.json("The password is incorrect");
            }
        } else {
            return res.json("No record existed");
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ status: "Error", message: "Internal server error" });
    }
});

app.get('/user/:email', (req, res) => {
    const email = req.params.email;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                const userData = {
                    email: user.email,
                    address: user.address,
                    pic: user.pic ? user.pic.toString('base64') : null,
                    content: user.content
                };
                res.json(userData);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(error => {
            console.error("Database error:", error);
            res.status(500).json({ message: "Internal server error" });
        });
});

app.post('/update', async (req, res) => {
    try {
        const { email, address, content } = req.body;
        let pic = null;

        if (req.files && req.files.pic) {
            pic = req.files.pic.data;
        }

        // Find the user and update their data
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: email },
            {
                address: address,
                pic: pic,
                content: content
            },
            { new: true } // To return the updated document
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Add a product
// app.post('/add-product',verifyToken, async (req, res) => {
//     console.log('Received request to /add-product');

//     try {
//         const { name, description, price } = req.body;
//         let image = null;

//         if (req.files && req.files.image) {
//             image = req.files.image.data;
//         }

//         const newProduct = await ProductModel.create({
//             name,
//             description,
//             price,
//             image,
//         });

//         // const userEmail = req.user.email; // Get user's email from the decoded token
//         // console.log('User Email:', userEmail);

//         // if (!userEmail) {
//         //     return res.json('User email not found in token');
//         // }

//         // const user = await UserModel.findOneAndUpdate(
//         //     { email: userEmail },
//         //     { $push: { products: newProduct._id } }, // Add product's _id to user's products array
//         //     { new: true }
//         // );

//         // if (!user) {
//         //     return res.json('User not found');
//         // }

//         // console.log('User Updated:', user);

//         return res.json(newProduct);
//     } catch (error) {
//         console.error('Error adding product:', error);
//         return res.status(500).json({ message: 'Error adding product' });
//     }
// });






// app.post('/add-product', verifyToken, async (req, res) => {
//     try {
//         const { name, description, price } = req.body;
//         let image = null;

//         if (req.files && req.files.image) {
//             image = req.files.image.data;
//         }

//         // Verify the token to ensure user authenticity
//         const userEmail = req.decodedToken.email;

//         if (!userEmail) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         // Proceed with adding the product
//         const newProduct = await ProductModel.create({
//             name,
//             description,
//             price,
//             image,
//         });

//         const user = await UserModel.findOneAndUpdate(
//             { email: userEmail },
//             { $push: { products: newProduct._id } }, // Add product's _id to user's products array
//             { new: true }
//         );

//         if (!user) {
//             return res.json('User not found');
//         }

//         console.log('User Updated:', user);

//         return res.json(newProduct);
//     } catch (error) {
//         console.error('Error adding product:', error);
//         return res.status(500).json({ message: 'Error adding product', error: error.message });
//     }
// });


app.post('/add-product', verifyToken, async (req, res) => {
    try {
        const { name, description, price } = req.body;
        let image = null;

        if (req.files && req.files.image) {
            image = req.files.image.data;
        }

        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            image,
        });

        const userEmail = req.decodedToken.email;
        const user = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $push: { products: newProduct._id } },
            { new: true }
        );

        if (!user) {
            return res.json('User not found');
        }

        return res.json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});


// Fetch a list of products
//   app.get('/products', async (req, res) => {
//     try {
//       const products = await ProductModel.find();
//       res.json(products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

app.get('/products', async (req, res) => {
    try {
        const products = await ProductModel.find();

        const productsWithImageData = products.map(product => {
            return {
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image ? product.image.toString('base64') : null
            };
        });

        res.json(productsWithImageData);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// app.get('/user-products/:email', async (req, res) => {
//     try {
//         const userEmail = req.params.email;

//         // Find the user by their email and populate the products array
//         const user = await UserModel.findOne({ email: userEmail }).populate('products');

//         if (user) {
//             res.json({ products: user.products });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching user products:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.get('/user-products/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;

        // Find the user by their email and populate the products array
        const user = await UserModel.findOne({ email: userEmail }).populate('products');

        if (user) {
            const productsWithImageData = user.products.map(product => {
                return {
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image ? product.image.toString('base64') : null
                };
            });

            res.json(productsWithImageData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.put('/update-product/:productId', verifyToken, async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;

        let updatedProductData = {
            name,
            description,
            price,
        };

        if (req.files && req.files.image) {
            updatedProductData.image = req.files.image.data;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            updatedProductData,
            { new: true }
        );

        if (updatedProduct) {
            return res.json(updatedProduct);
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete('/delete-product/:productId', verifyToken, async (req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (deletedProduct) {
            // Also remove the product from the user's products array
            const userEmail = req.decodedToken.email;
            const user = await UserModel.findOneAndUpdate(
                { email: userEmail },
                { $pull: { products: productId } },
                { new: true }
            );

            if (user) {
                return res.json({ message: 'Product deleted successfully' });
            } else {
                return res.status(500).json({ message: 'Failed to update user products' });
            }
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



app.get('/admin/dashboard', verifyToken, async (req, res) => {
    try {
        const totalProducts = await ProductModel.countDocuments();
        const totalUsers = await UserModel.countDocuments();

        res.json({ totalProducts, totalUsers });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/admin/users', verifyToken, async (req, res) => {
    try {
        const users = await UserModel.find({}, 'email role address pic content products')
            .populate('products', '_id name description price');

        const usersWithImageData = users.map(user => {
            return {
                email: user.email,
                role: user.role,
                address: user.address,
                pic: user.pic ? user.pic.toString('base64') : null,
                content: user.content,
                products: user.products
            };
        });

        res.json(usersWithImageData);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


const port = 8081;

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
});

// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log('Generated Secret Key:', secretKey);

