
ALTER TABLE users
DROP CONSTRAINT users_profile_photo_id_fkey;
ALTER TABLE users
ADD CONSTRAINT users_profile_photo_id_fkey
FOREIGN KEY (profile_photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE organizers
DROP CONSTRAINT organizers_user_id_fkey;
ALTER TABLE organizers
ADD CONSTRAINT organizers_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE organizers
DROP CONSTRAINT organizers_membership_plan_id_fkey;
ALTER TABLE organizers
ADD CONSTRAINT organizers_membership_plan_id_fkey
FOREIGN KEY (membership_plan_id)
REFERENCES membership_plans(id)
ON DELETE CASCADE;

ALTER TABLE organizers
DROP CONSTRAINT organizers_logo_photo_id_fkey;
ALTER TABLE organizers
ADD CONSTRAINT organizers_logo_photo_id_fkey
FOREIGN KEY (logo_photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE organizers
DROP CONSTRAINT organizers_banner_photo_id_fkey;
ALTER TABLE organizers
ADD CONSTRAINT organizers_banner_photo_id_fkey
FOREIGN KEY (banner_photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE participants
DROP CONSTRAINT participants_user_id_fkey;
ALTER TABLE participants
ADD CONSTRAINT participants_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE admins
DROP CONSTRAINT admins_user_id_fkey;
ALTER TABLE admins
ADD CONSTRAINT admins_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE membership_transactions
DROP CONSTRAINT membership_transactions_organizer_id_fkey;
ALTER TABLE membership_transactions
ADD CONSTRAINT membership_transactions_organizer_id_fkey
FOREIGN KEY (organizer_id)
REFERENCES organizers(id)
ON DELETE CASCADE;

ALTER TABLE membership_transactions
DROP CONSTRAINT membership_transactions_transaction_id_fkey;
ALTER TABLE membership_transactions
ADD CONSTRAINT membership_transactions_transaction_id_fkey
FOREIGN KEY (transaction_id)
REFERENCES transactions(id)
ON DELETE CASCADE;

ALTER TABLE workshops
DROP CONSTRAINT workshops_organizer_id_fkey;
ALTER TABLE workshops
ADD CONSTRAINT workshops_organizer_id_fkey
FOREIGN KEY (organizer_id)
REFERENCES organizers(id)
ON DELETE CASCADE;

ALTER TABLE workshop_reservations
DROP CONSTRAINT workshop_reservations_workshop_id_fkey;
ALTER TABLE workshop_reservations
ADD CONSTRAINT workshop_reservations_workshop_id_fkey
FOREIGN KEY (workshop_id)
REFERENCES workshops(id)
ON DELETE CASCADE;

ALTER TABLE workshop_reservations
DROP CONSTRAINT workshop_reservations_participant_id_fkey;
ALTER TABLE workshop_reservations
ADD CONSTRAINT workshop_reservations_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(id)
ON DELETE CASCADE;

ALTER TABLE workshop_reservations
DROP CONSTRAINT workshop_reservations_transaction_id_fkey;
ALTER TABLE workshop_reservations
ADD CONSTRAINT workshop_reservations_transaction_id_fkey
FOREIGN KEY (transaction_id)
REFERENCES transactions(id)
ON DELETE CASCADE;

ALTER TABLE exhibition_registrations
DROP CONSTRAINT exhibition_registrations_participant_id_fkey;
ALTER TABLE exhibition_registrations
ADD CONSTRAINT exhibition_registrations_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(id)
ON DELETE CASCADE;

ALTER TABLE exhibition_registrations
DROP CONSTRAINT exhibition_registrations_exhibition_id_fkey;
ALTER TABLE exhibition_registrations
ADD CONSTRAINT exhibition_registrations_exhibition_id_fkey
FOREIGN KEY (exhibition_id)
REFERENCES exhibitions(id)
ON DELETE CASCADE;

ALTER TABLE comments
DROP CONSTRAINT comments_user_id_fkey;
ALTER TABLE comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE comments
DROP CONSTRAINT comments_exhibition_id_fkey;
ALTER TABLE comments
ADD CONSTRAINT comments_exhibition_id_fkey
FOREIGN KEY (exhibition_id)
REFERENCES exhibitions(id)
ON DELETE CASCADE;

ALTER TABLE comments
DROP CONSTRAINT comments_photo_id_fkey;
ALTER TABLE comments
ADD CONSTRAINT comments_photo_id_fkey
FOREIGN KEY (photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE exhibitions
DROP CONSTRAINT exhibitions_organizer_id_fkey;
ALTER TABLE exhibitions
ADD CONSTRAINT exhibitions_organizer_id_fkey
FOREIGN KEY (organizer_id)
REFERENCES organizers(id)
ON DELETE CASCADE;

ALTER TABLE products
DROP CONSTRAINT products_photo_id_fkey;
ALTER TABLE products
ADD CONSTRAINT products_photo_id_fkey
FOREIGN KEY (photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE orders
DROP CONSTRAINT orders_participant_id_fkey;
ALTER TABLE orders
ADD CONSTRAINT orders_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(id)
ON DELETE CASCADE;

ALTER TABLE orders
DROP CONSTRAINT orders_transaction_id_fkey;
ALTER TABLE orders
ADD CONSTRAINT orders_transaction_id_fkey
FOREIGN KEY (transaction_id)
REFERENCES transactions(id)
ON DELETE CASCADE;

ALTER TABLE products_orders
DROP CONSTRAINT products_orders_product_id_fkey;
ALTER TABLE products_orders
ADD CONSTRAINT products_orders_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

ALTER TABLE products_orders
DROP CONSTRAINT products_orders_order_id_fkey;
ALTER TABLE products_orders
ADD CONSTRAINT products_orders_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

ALTER TABLE product_reviews
DROP CONSTRAINT product_reviews_participant_id_fkey;
ALTER TABLE product_reviews
ADD CONSTRAINT product_reviews_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(id)
ON DELETE CASCADE;

ALTER TABLE product_reviews
DROP CONSTRAINT product_reviews_product_id_fkey;
ALTER TABLE product_reviews
ADD CONSTRAINT product_reviews_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

ALTER TABLE notification_subscriptions
DROP CONSTRAINT notification_subscriptions_user_id_fkey;
ALTER TABLE notification_subscriptions
ADD CONSTRAINT notification_subscriptions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE organizer_photos
DROP CONSTRAINT organizer_photos_photo_id_fkey;
ALTER TABLE organizer_photos
ADD CONSTRAINT organizer_photos_photo_id_fkey
FOREIGN KEY (photo_id)
REFERENCES photos(id)
ON DELETE CASCADE;

ALTER TABLE organizer_photos
DROP CONSTRAINT organizer_photos_organizer_fkey;
ALTER TABLE organizer_photos
ADD CONSTRAINT organizer_photos_organizer_fkey
FOREIGN KEY (organizer_id)
REFERENCES organizers(id)
ON DELETE CASCADE;

ALTER TABLE exhibition_products
DROP CONSTRAINT exhibition_products_product_id_fkey;
ALTER TABLE exhibition_products
ADD CONSTRAINT exhibition_products_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

ALTER TABLE exhibition_products
DROP CONSTRAINT exhibition_products_exhibition_id_fkey;
ALTER TABLE exhibition_products
ADD CONSTRAINT exhibition_products_exhibition_id_fkey
FOREIGN KEY (exhibition_id)
REFERENCES exhibitions(id)
ON DELETE CASCADE;

ALTER TABLE read_notifications
DROP CONSTRAINT read_notifications_user_id_fkey;
ALTER TABLE read_notifications
ADD CONSTRAINT read_notifications_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE read_notifications
DROP CONSTRAINT read_notifications_notification_id_fkey;
ALTER TABLE read_notifications
ADD CONSTRAINT read_notifications_notification_id_fkey
FOREIGN KEY (notification_id)
REFERENCES notifications(id)
ON DELETE CASCADE;

ALTER TABLE products
DROP CONSTRAINT products_exhibition_id_fkey;
ALTER TABLE products
ADD CONSTRAINT products_exhibition_id_fkey
FOREIGN KEY (exhibition_id)
REFERENCES exhibitions(id)
ON DELETE CASCADE;
