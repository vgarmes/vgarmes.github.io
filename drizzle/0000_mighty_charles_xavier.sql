CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`likes` integer DEFAULT 0,
	`views` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `user_likes` (
	`user_id` text,
	`post_id` text,
	`likes` integer DEFAULT 1,
	PRIMARY KEY(`post_id`, `user_id`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slugIdx` ON `posts` (`slug`);