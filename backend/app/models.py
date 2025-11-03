from . import db
from werkzeug.security import generate_password_hash, check_password_hash

# -------------------------
# Admins table
# -------------------------
class Admin(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    can_change_prices = db.Column(db.Boolean, nullable=True)
    can_approve_users = db.Column(db.Boolean, nullable=True)
    can_send_notifications = db.Column(db.Boolean, nullable=True)

# -------------------------
# Comments table
# -------------------------
class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    exhibition_id = db.Column(db.Integer, nullable=True)
    content = db.Column(db.Text, nullable=True)
    photo_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# -------------------------
# ExhibitionProducts table
# -------------------------
class ExhibitionProduct(db.Model):
    __tablename__ = "exhibition_products"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=True)
    exhibition_id = db.Column(db.Integer, nullable=True)

# -------------------------
# ExhibitionRegistrations table
# -------------------------
class ExhibitionRegistration(db.Model):
    __tablename__ = "exhibition_registrations"
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, nullable=True)
    exhibition_id = db.Column(db.Integer, nullable=True)
    approved = db.Column(db.Boolean, nullable=True)

# -------------------------
# Exhibitions table
# -------------------------
class Exhibition(db.Model):
    __tablename__ = "exhibitions"
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, nullable=True)
    title = db.Column(db.Text, nullable=True)
    location = db.Column(db.Text, nullable=True)
    date_time = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)

# -------------------------
# MembershipPlans table
# -------------------------
class MembershipPlan(db.Model):
    __tablename__ = "membership_plans"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric, nullable=True)
    duration_months = db.Column(db.Integer, nullable=True)

# -------------------------
# MembershipTransactions table
# -------------------------
class MembershipTransaction(db.Model):
    __tablename__ = "membership_transactions"
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, nullable=True)
    transaction_id = db.Column(db.Integer, nullable=True)

# -------------------------
# NotificationSubscriptions table
# -------------------------
class NotificationSubscription(db.Model):
    __tablename__ = "notification_subscriptions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    type = db.Column(db.Text, nullable=True)

# -------------------------
# Notifications table
# -------------------------
class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=True)
    type = db.Column(db.Text, nullable=True)
    title = db.Column(db.Text, nullable=True)
    subtitle = db.Column(db.Text, nullable=True)
    subject = db.Column(db.Text, nullable=True)

# -------------------------
# Orders table
# -------------------------
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, nullable=True)
    order_time = db.Column(db.DateTime, nullable=True)
    transaction_id = db.Column(db.Integer, nullable=True)

# -------------------------
# OrganizerPhotos table
# -------------------------
class OrganizerPhoto(db.Model):
    __tablename__ = "organizer_photos"
    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, nullable=True)
    organizer_id = db.Column(db.Integer, nullable=True)

# -------------------------
# Organizers table
# -------------------------
class Organizer(db.Model):
    __tablename__ = "organizers"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    membership_plan_id = db.Column(db.Integer, nullable=True)
    membership_expiry_date = db.Column(db.Date, nullable=True)
    profile_name = db.Column(db.Text, nullable=True)
    logo_photo_id = db.Column(db.Integer, nullable=True)
    banner_photo_id = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True)
    approved_by_admin = db.Column(db.Boolean, nullable=True)

# -------------------------
# Participants table
# -------------------------
class Participant(db.Model):
    __tablename__ = "participants"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)

# -------------------------
# Photos table
# -------------------------
class Photo(db.Model):
    __tablename__ = "photos"
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)

# -------------------------
# ProductReviews table
# -------------------------
class ProductReview(db.Model):
    __tablename__ = "product_reviews"
    id = db.Column(db.Integer, primary_key=True)
    participant_id = db.Column(db.Integer, nullable=True)
    product_id = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)

# -------------------------
# Products table
# -------------------------
class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric, nullable=True)
    photo_id = db.Column(db.Integer, nullable=True)
    quantity_left = db.Column(db.Integer, nullable=True)
    exhibition_id = db.Column(db.Integer, nullable=True)

# -------------------------
# ProductsOrders table
# -------------------------
class ProductOrder(db.Model):
    __tablename__ = "products_orders"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=True)
    order_id = db.Column(db.Integer, nullable=True)
    quantity = db.Column(db.Integer, nullable=True)

# -------------------------
# ReadNotifications table
# -------------------------
class ReadNotification(db.Model):
    __tablename__ = "read_notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    notification_id = db.Column(db.Integer, nullable=True)
    marked_as_read = db.Column(db.Boolean, nullable=True)

# -------------------------
# Transactions table
# -------------------------
class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric, nullable=True)
    method = db.Column(db.Text, nullable=True)
    date_time = db.Column(db.DateTime, nullable=True)

# -------------------------
# Users table
# -------------------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    username = db.Column(db.Text, nullable=True)
    address = db.Column(db.Text, nullable=True)
    mail = db.Column(db.Text, nullable=True)
    phone = db.Column(db.Text, nullable=True)
    profile_photo_id = db.Column(db.Integer, nullable=True)

# -------------------------
# WorkshopReservations table
# -------------------------
class WorkshopReservation(db.Model):
    __tablename__ = "workshop_reservations"
    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, nullable=True)
    participant_id = db.Column(db.Integer, nullable=True)
    transaction_id = db.Column(db.Integer, nullable=True)

# -------------------------
# Workshops table
# -------------------------
class Workshop(db.Model):
    __tablename__ = "workshops"
    id = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, nullable=True)
    title = db.Column(db.Text, nullable=True)
    duration = db.Column(db.Time, nullable=True)
    date_time = db.Column(db.DateTime, nullable=True)
    location = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, nullable=True)
    price = db.Column(db.Numeric, nullable=True)
    description = db.Column(db.Text, nullable=True)
