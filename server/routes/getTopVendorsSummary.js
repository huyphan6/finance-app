import express from "express";
import plaidClient from "../plaidConfig.js";

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        const topVendors = {};
        const transactions = request.body.transactions;

        transactions.added.map((tx) => {
            if (!(tx.personal_finance_category.primary in topVendors)) {
                topVendors[tx.personal_finance_category.primary] = tx.amount;
            } else {
                topVendors[tx.personal_finance_category.primary] += tx.amount;
            }
        });

        response.json(topVendors);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

export default router;
