import express from "express";
import plaidClient from "../plaidConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        const spendingCategories = {};
        const transactions = request.body.transactions;

        transactions.added.map((tx) => {
            if (!(tx.personal_finance_category.primary in spendingCategories)) {
                spendingCategories[tx.personal_finance_category.primary] = 1;
            } else {
                spendingCategories[tx.personal_finance_category.primary] += 1;
            }
        });

        response.json(spendingCategories);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

export default router;