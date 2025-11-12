CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "first_name" text,
  "last_name" text,
  "username" text,
  "address" text,
  "mail" text,
  "phone" text,
  "profile_photo_id" int
);

CREATE TABLE "organizers" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "membership_plan_id" int,
  "membership_expiry_date" date,
  "profile_name" text,
  "logo_photo_id" int,
  "banner_photo_id" int,
  "description" text,
  "approved_by_admin" bool
);

CREATE TABLE "participants" (
  "id" int PRIMARY KEY,
  "user_id" int
);

CREATE TABLE "admins" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "can_change_prices" bool,
  "can_approve_users" bool,
  "can_send_notifications" bool
);

CREATE TABLE "photos" (
  "id" int PRIMARY KEY,
  "url" text,
  "description" text
);

CREATE TABLE "membership_plans" (
  "id" int PRIMARY KEY,
  "name" text,
  "price" decimal,
  "duration_months" int
);

CREATE TABLE "membership_transactions" (
  "id" int PRIMARY KEY,
  "organizer_id" int,
  "transaction_id" int
);

CREATE TABLE "workshops" (
  "id" int PRIMARY KEY,
  "organizer_id" int,
  "title" text,
  "duration" time,
  "date_time" datetime,
  "location" text,
  "capacity" int,
  "price" decimal,
  "description" text
);

CREATE TABLE "workshop_reservations" (
  "id" int PRIMARY KEY,
  "workshop_id" int,
  "participant_id" int,
  "transaction_id" int
);

CREATE TABLE "exhibition_registrations" (
  "id" int PRIMARY KEY,
  "participant_id" int,
  "exhibition_id" int,
  "approved" bool
);

CREATE TABLE "comments" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "exhibition_id" int,
  "content" text,
  "photo_id" int,
  "created_at" datetime
);

CREATE TABLE "exhibitions" (
  "id" int PRIMARY KEY,
  "organizer_id" int,
  "title" text,
  "location" text,
  "date_time" datetime,
  "description" text
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "exhibition_id" int,
  "name" text,
  "description" text,
  "price" decimal,
  "photo_id" int,
  "quantity_left" int
);

CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "participant_id" int,
  "order_time" datetime,
  "transaction_id" int
);

CREATE TABLE "products_orders" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "order_id" int,
  "quantity" int
);

CREATE TABLE "product_reviews" (
  "id" int PRIMARY KEY,
  "participant_id" int,
  "product_id" int,
  "rating" int,
  "text" text,
  "created_at" datetime
);

CREATE TABLE "notification_subscriptions" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "type" text
);

CREATE TABLE "organizer_photos" (
  "id" int PRIMARY KEY,
  "photo_id" int,
  "organizer" int
);

CREATE TABLE "transactions" (
  "id" int PRIMARY KEY,
  "amount" decimal,
  "method" text,
  "date_time" datetime
);

CREATE TABLE "exhibition_products" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "exhibition_id" int
);

CREATE TABLE "read_notifications" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "notification_id" int,
  "marked_as_read" bool
);

CREATE TABLE "notifications" (
  "id" int PRIMARY KEY,
  "type" text,
  "title" text,
  "subtitle" text,
  "subject" text,
  "body" text
);

ALTER TABLE "users" ADD FOREIGN KEY ("profile_photo_id") REFERENCES "photos" ("id");

ALTER TABLE "organizers" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "organizers" ADD FOREIGN KEY ("membership_plan_id") REFERENCES "membership_plans" ("id");

ALTER TABLE "organizers" ADD FOREIGN KEY ("logo_photo_id") REFERENCES "photos" ("id");

ALTER TABLE "organizers" ADD FOREIGN KEY ("banner_photo_id") REFERENCES "photos" ("id");

ALTER TABLE "participants" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "admins" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "membership_transactions" ADD FOREIGN KEY ("organizer_id") REFERENCES "organizers" ("id");

ALTER TABLE "membership_transactions" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");

ALTER TABLE "workshops" ADD FOREIGN KEY ("organizer_id") REFERENCES "organizers" ("id");

ALTER TABLE "workshop_reservations" ADD FOREIGN KEY ("workshop_id") REFERENCES "workshops" ("id");

ALTER TABLE "workshop_reservations" ADD FOREIGN KEY ("participant_id") REFERENCES "participants" ("id");

ALTER TABLE "workshop_reservations" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");

ALTER TABLE "exhibition_registrations" ADD FOREIGN KEY ("participant_id") REFERENCES "participants" ("id");

ALTER TABLE "exhibition_registrations" ADD FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("photo_id") REFERENCES "photos" ("id");

ALTER TABLE "exhibitions" ADD FOREIGN KEY ("organizer_id") REFERENCES "organizers" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("photo_id") REFERENCES "photos" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("participant_id") REFERENCES "participants" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");

ALTER TABLE "products_orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products_orders" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "product_reviews" ADD FOREIGN KEY ("participant_id") REFERENCES "participants" ("id");

ALTER TABLE "product_reviews" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "notification_subscriptions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "organizer_photos" ADD FOREIGN KEY ("photo_id") REFERENCES "photos" ("id");

ALTER TABLE "organizer_photos" ADD FOREIGN KEY ("organizer") REFERENCES "organizers" ("id");

ALTER TABLE "exhibition_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "exhibition_products" ADD FOREIGN KEY ("exhibition_id") REFERENCES "exhibitions" ("id");

ALTER TABLE "read_notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "read_notifications" ADD FOREIGN KEY ("notification_id") REFERENCES "notifications" ("id");
