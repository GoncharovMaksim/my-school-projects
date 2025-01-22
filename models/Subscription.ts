import mongoose, { Schema } from 'mongoose';

// Ваши поля схемы
const SubscriptionSchema = new Schema({
	endpoint: { type: String, required: true, unique: true },
	keys: {
		p256dh: { type: String, required: true },
		auth: { type: String, required: true },
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Предотвращение повторного создания модели
const Subscription =
	mongoose.models.Subscription ||
	mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
