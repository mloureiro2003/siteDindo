export class Ingredient {
    code;
    ingredient;
    foodGroup;
    synonym;
    specifications;
    constructor(code, ingredient, foodGroup, synonym, specifications) {
        this.code = code;
        this.ingredient = ingredient;
        this.foodGroup = foodGroup;
        this.synonym = synonym;
        this.specifications = specifications;
    }
    getIngredient() {
        return this.ingredient;
    }
    getFoodGroup() {
        return this.foodGroup;
    }
    getCode() {
        return this.code;
    }
    getSynonym() {
        return this.synonym ?? "";
    }
    getSpecification() {
        return this.specifications ?? "";
    }
    setIngredient(newName) {
        this.ingredient = newName;
    }
    setCode(newCode) {
        this.code = newCode;
    }
    setFoodGroup(newFoodGroup) {
        this.foodGroup = newFoodGroup;
    }
    setSynonym(newSynonym) {
        this.synonym = newSynonym;
    }
    setSpecification(newSpecification) {
        this.specifications = newSpecification;
    }
}
//# sourceMappingURL=ingredient.js.map