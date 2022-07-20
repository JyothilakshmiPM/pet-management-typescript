"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRoute = void 0;
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const controller_2 = require("../controllers/controller");
const petRoute = () => {
    const router = (0, express_1.Router)();
    router.post("/signup", controller_1.signup);
    router.post("/login", controller_1.login);
    router.post("/category", controller_1.category);
    router.post("/category/:id/pet", controller_1.pet);
    router.get("/category", controller_1.getCategoryAll);
    router.get("/category/:id", controller_1.getCategory);
    router.get("/pet/:id", controller_1.getPet);
    router.get("/category/:id/pet", controller_2.getPetByCategory);
    router.put("/category/:id", controller_2.updateCategory);
    router.put("/pet/:id", controller_2.updatePet);
    router.delete("/category/:id", controller_2.deleteCategory);
    router.delete("/pet/:id", controller_2.deletePet);
    return router;
};
exports.petRoute = petRoute;
//# sourceMappingURL=routes.js.map