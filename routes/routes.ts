import { Router } from 'express';
import { Server } from 'http';
import {app} from '../server';
import { signup, login, category, pet, getCategoryAll, getCategory, getPet } from '../controllers/controller';
import { getPetByCategory, updateCategory, updatePet, deleteCategory, deletePet } from '../controllers/controller';

const petRoute = () => {
    const router = Router();

    router.post("/signup", signup);

    router.post("/login", login);

    router.post("/category", category);

    router.post("/category/:id/pet", pet);

    router.get("/category", getCategoryAll);

    router.get("/category/:id", getCategory);

    router.get("/pet/:id", getPet);

    router.get("/category/:id/pet", getPetByCategory);

    router.put("/category/:id", updateCategory);

    router.put("/pet/:id", updatePet);

    router.delete("/category/:id", deleteCategory);

    router.delete("/pet/:id", deletePet);

    return router;
}

export { petRoute };