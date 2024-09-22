import express from "express";
import db from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {

    //TODO: check with a secret, whether request came from the HDFC bank only
    //TODO: Zod validation
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    try {
        await db.$transaction(async tx => {
    
            await tx.balance.update({
                where: {
                    userId: +paymentInformation.userId
                },
                data: {
                    amount: {
                        increment: +paymentInformation.amount // need to check whether DB will apply locks and update the balance
                    }
                }
            });
        
            await tx.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success"
                }
            });
        })
    
    
    
        return res.json({ message: "captured" });
    } catch (error) {
        return res.status(411).json({ message: "error happened while processing the payment"})
    }
});


app.listen(3005, () => {
    console.log("BANK WEBHOOK SERVER STARTED ON 3005");
})