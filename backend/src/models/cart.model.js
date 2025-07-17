import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const cartSchema = new Schema(
    {
        
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        totalQuantity:{
            type:Number,
            default:1
        },
        

    },
    {
        timestamps: true
    }
)

cartSchema.plugin(mongooseAggregatePaginate)



export const Cart = mongoose.model("Cart", videoSchema)