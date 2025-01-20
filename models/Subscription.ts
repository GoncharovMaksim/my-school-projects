import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
	endpoint: { type: String, required: true, unique: true },
	keys: {
		p256dh: { type: String, required: true },
		auth: { type: String, required: true },
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}, // Связь с пользователем (если нужна)
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Subscription', SubscriptionSchema);
