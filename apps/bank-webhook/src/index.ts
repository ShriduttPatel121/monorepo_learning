import express from "express";
import { PrismaClient } from "@repo/db/client"

const app = express();
app.use(express.json());

const db = new PrismaClient();

app.post("hdfcWebhook", async (req, res) => {

    //TODO: check with a secret, whether request came from the HDFC bank only
    //TODO: Zod validation
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
    }

    db.$transaction(async tx => {

        await tx.balance.update({
            where: {
                userId: req.body.userId
            },
            data: {
                amount: {
                    increment: req.body.amount // need to check whether DB will apply locks and update the balance
                }
            }
        });
    
        await tx.onRampTransaction.update({
            where: {
                token: paymentInfo.token
            },
            data: {
                status: "Success"
            }
        });
    })



    return res.json({ message: "captured" });
})