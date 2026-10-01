export class FoodGroup {
    code;
    foodGroup;
    constructor(code, foodGroup) {
        this.code = code;
        this.foodGroup = foodGroup;
    }
    getFoodGroup() {
        return this.foodGroup;
    }
    getCode() {
        return this.code;
    }
    setFoodGroup(newFoodGroup) {
        this.foodGroup = newFoodGroup;
    }
    setCode(newCode) {
        this.code = newCode;
    }
}
//# sourceMappingURL=foodGroup.js.map