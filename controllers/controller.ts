import { Request, Response } from "express";
import { User, Category, Pet } from "../models/model";
import * as bcrypt from 'bcrypt';
import * as jwt  from 'jsonwebtoken';
const mongooseErrorHandler = require('mongoose-error-handler');

//Signup
const signup = async(req: Request, res: Response) => {
    try{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }
        const email_exist = await User.findOne( {email: req.body.email} );
        if (email_exist) {
            res.status(400).send({ message: "Email is taken!" });
            return;
        }
        
        const { first_name, last_name, password, email, age, country, role } = req.body;
        bcrypt.hash(password, 10, function(err: any, hash: string) {
            if(err) {
                res.status(400).json({ 
                    message: "User not created",
                    error: err.message,
                })
                return;
            }
            const user = new User({ first_name,last_name,password: hash,email,age,country,role });
            user.save(function(error,result) {
                if(result) {
                    res.status(200).json({message: "User successfully created",user});
                    return;
                }
                const errors = mongooseErrorHandler.set(error);
                res.status(400).send({ errors });
                return;
            });
        });   
    }catch(error) {
        res.status(400).json(error)
    }
}


// LOGIN
const login = async (req: Request, res: Response) => {
    try{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }
        if (!req.body.password) {
            res.status(400).send({ message: "password is required" });
            return;
        }

        if (!req.body.email) {
            res.status(400).send({ message: "Email is required" });
            return;
        }
        const user = await User.findOne({ email:req.body.email });
        if (!user) {
            res.status(401).json({
            message: "Invalid Credentials",
            error: "User not found", });
        } else {
            bcrypt.compare(req.body.password, user.password).then(function (result) {
                if (result) {
                    jwt.sign({user}, "secret", { expiresIn: '1h' },(err: any, token) => {
                        if(err) { console.log(err) }    
                        res.send(token);
                    });
                } else {
                    res.status(401).json({
                        message: "Login not successful",
                        error: "User not found",
                    });
                } 
            });
        }
    }catch (err) { console.log(err);}

}


//POST -Category
const category = async (req: Request, res: Response) => {
    try {
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }

                if(Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }

                const { name, status } = req.body;
                const category = new Category({ name,status });
        
                await category.save(function(error,result) {
                    if(result) {
                        res.status(200).json({message: "Category added",category});
                        return;
                    }
                    const errors = mongooseErrorHandler.set(error);
                    res.status(400).send({ errors });
                    return;
                });
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    } catch(error) {
        res.status(400).json(error);
        return;
    }
};


//POST - Pet
const pet = async (req: Request, res: Response) => {
    try {
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }

                if(Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                
                const category_id = req.params.id;
                const { name, status, breed, age, create_date, update_date } = req.body;
                const pet = new Pet({ name, status, category_id, breed, age, create_date, update_date });

                await pet.save(function(error,result) {
                    if(result) {
                        res.status(200).json({message: "Pet added",pet});
                        return;
                    }
                    const errors = mongooseErrorHandler.set(error);
                    res.status(400).send({ errors });
                    return;
                });
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    } catch(error) {
        console.log(error);

    }
};


//GET - All Categories 
const getCategoryAll = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const categories = await Category.find();
                if(categories) {
                    res.status(200).json(categories);
                }
                else {
                    res.status(400).json("No Categories Available !");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};


//GET - Category
const getCategory = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const id = req.params.id ;
                const category = await Category.findById(id);
                if(!category){
                    res.json("Invalid Category ID!");
                }
                else{
                    res.json(category);
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};


//GET - Pet
const getPet = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const id = req.params.id;
                const pet =  await Pet.findById(id);
                if(pet) {
                    res.json(pet);
                }
                else {
                    res.json("No pets of this ID");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};


//GET - Pet by Category ID
const getPetByCategory = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const cat_id = req.params.id;
                const pet = await Pet.find({ 'category_id': cat_id });
                if(pet) {
                    res.json(pet);
                }
                else {
                    res.json("No pets of this ID");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};

//UPDATE - Category
const updateCategory = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                if(Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                const cat_id = req.params.id;
                const updatedData = req.body;
                const options = { new: true };
                const category = await Category.findByIdAndUpdate(cat_id, updatedData, options);
                if(category) {
                    res.json(category);
                }
                else{
                    res.json("Invalid Category ID");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};


//UPDATE - Pet
const updatePet = async (req: Request, res: Response) => {
    try {
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('ERROR: Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                if (Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                const pet_id = req.params.id;
                const updatedData = req.body;
                const options = { new: true };
                const pet = await Pet.findByIdAndUpdate(pet_id, updatedData, options);
                if(pet) {
                    res.json(pet);
                }
                else {
                    res.json("Invalid Pet ID");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};


// DELETE - Category
const deleteCategory = async (req: Request, res: Response) => {
    try{
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const cat_id = req.params.id;
                const category = await Category.findByIdAndDelete(cat_id);
                const pet = await Pet.deleteMany({ category_id:cat_id });
                if(category) {
                    res.json(`Deleted category and Pets of Category id ${ cat_id }`);
                }
                else{
                    res.json("Invalid Category ID!");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json( error );
    }
};


// DELETE - Pet
const deletePet = async (req: Request, res: Response) => {
    try {
        let token = req.headers["authorization"];
        if(token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', async(err, decoded) => {
                if(err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                } 
                if(decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const pet_id = req.params.id;
                const pet = await Pet.findByIdAndDelete(pet_id);
                if(pet) {
                    res.json(`Deleted Pet of id ${pet_id}`);
                }
                else {
                    res.json("Invalid Pet ID!");
                }
            });
        } else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }   
    }catch(error) {
        res.status(400).json(error);
    }
};

export { signup, login, category, pet, getCategoryAll, getPet, getPetByCategory };
export { getCategory, updateCategory, updatePet, deleteCategory, deletePet };