"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePet = exports.deleteCategory = exports.updatePet = exports.updateCategory = exports.getCategory = exports.getPetByCategory = exports.getPet = exports.getCategoryAll = exports.pet = exports.category = exports.login = exports.signup = void 0;
const model_1 = require("../models/model");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const mongooseErrorHandler = require('mongoose-error-handler');
//Signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }
        const email_exist = yield model_1.User.findOne({ email: req.body.email });
        if (email_exist) {
            res.status(400).send({ message: "Email is taken!" });
            return;
        }
        const { first_name, last_name, password, email, age, country, role } = req.body;
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                res.status(400).json({
                    message: "User not created",
                    error: err.message,
                });
                return;
            }
            const user = new model_1.User({ first_name, last_name, password: hash, email, age, country, role });
            user.save(function (error, result) {
                if (result) {
                    res.status(200).json({ message: "User successfully created", user });
                    return;
                }
                const errors = mongooseErrorHandler.set(error);
                res.status(400).send({ errors });
                return;
            });
        });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.signup = signup;
// LOGIN
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        const user = yield model_1.User.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).json({
                message: "Invalid Credentials",
                error: "User not found",
            });
        }
        else {
            bcrypt.compare(req.body.password, user.password).then(function (result) {
                if (result) {
                    jwt.sign({ user }, "secret", { expiresIn: '1h' }, (err, token) => {
                        if (err) {
                            console.log(err);
                        }
                        res.send(token);
                    });
                }
                else {
                    res.status(401).json({
                        message: "Login not successful",
                        error: "User not found",
                    });
                }
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.login = login;
//POST -Category
const category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                if (Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                const { name, status } = req.body;
                const category = new model_1.Category({ name, status });
                yield category.save(function (error, result) {
                    if (result) {
                        res.status(200).json({ message: "Category added", category });
                        return;
                    }
                    const errors = mongooseErrorHandler.set(error);
                    res.status(400).send({ errors });
                    return;
                });
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
        return;
    }
});
exports.category = category;
//POST - Pet
const pet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                if (Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                const category_id = req.params.id;
                const { name, status, breed, age, create_date, update_date } = req.body;
                const pet = new model_1.Pet({ name, status, category_id, breed, age, create_date, update_date });
                yield pet.save(function (error, result) {
                    if (result) {
                        res.status(200).json({ message: "Pet added", pet });
                        return;
                    }
                    const errors = mongooseErrorHandler.set(error);
                    res.status(400).send({ errors });
                    return;
                });
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.pet = pet;
//GET - All Categories 
const getCategoryAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const categories = yield model_1.Category.find();
                if (categories) {
                    res.status(200).json(categories);
                }
                else {
                    res.status(400).json("No Categories Available !");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getCategoryAll = getCategoryAll;
//GET - Category
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const id = req.params.id;
                const category = yield model_1.Category.findById(id);
                if (!category) {
                    res.json("Invalid Category ID!");
                }
                else {
                    res.json(category);
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getCategory = getCategory;
//GET - Pet
const getPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const id = req.params.id;
                const pet = yield model_1.Pet.findById(id);
                if (pet) {
                    res.json(pet);
                }
                else {
                    res.json("No pets of this ID");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getPet = getPet;
//GET - Pet by Category ID
const getPetByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const cat_id = req.params.id;
                const pet = yield model_1.Pet.find({ 'category_id': cat_id });
                if (pet) {
                    res.json(pet);
                }
                else {
                    res.json("No pets of this ID");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getPetByCategory = getPetByCategory;
//UPDATE - Category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                if (Object.keys(req.body).length === 0) {
                    res.status(400).send({ message: "Content can not be empty!" });
                    return;
                }
                const cat_id = req.params.id;
                const updatedData = req.body;
                const options = { new: true };
                const category = yield model_1.Category.findByIdAndUpdate(cat_id, updatedData, options);
                if (category) {
                    res.json(category);
                }
                else {
                    res.json("Invalid Category ID");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updateCategory = updateCategory;
//UPDATE - Pet
const updatePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('ERROR: Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
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
                const pet = yield model_1.Pet.findByIdAndUpdate(pet_id, updatedData, options);
                if (pet) {
                    res.json(pet);
                }
                else {
                    res.json("Invalid Pet ID");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updatePet = updatePet;
// DELETE - Category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const cat_id = req.params.id;
                const category = yield model_1.Category.findByIdAndDelete(cat_id);
                const pet = yield model_1.Pet.deleteMany({ category_id: cat_id });
                if (category) {
                    res.json(`Deleted category and Pets of Category id ${cat_id}`);
                }
                else {
                    res.json("Invalid Category ID!");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.deleteCategory = deleteCategory;
// DELETE - Pet
const deletePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (token) {
            token = token.replace(/^Bearer\s+/, "");
            jwt.verify(token, 'secret', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log('Could not connect to the protected route');
                    res.status(403).json("Forbidden");
                    return;
                }
                if (decoded === undefined) {
                    console.log("Invalid token");
                    res.status(403).json('Forbidden');
                    return;
                }
                const pet_id = req.params.id;
                const pet = yield model_1.Pet.findByIdAndDelete(pet_id);
                if (pet) {
                    res.json(`Deleted Pet of id ${pet_id}`);
                }
                else {
                    res.json("Invalid Pet ID!");
                }
            }));
        }
        else {
            console.log("No Token Set in Headers!");
            res.status(400).json("Authentication Failed!");
            return;
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.deletePet = deletePet;
//# sourceMappingURL=controller.js.map