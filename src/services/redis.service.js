import RedisClient from "ioredis";

export const client = new RedisClient({
  port: 18005, // Redis port
  host: "redis-18005.c295.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  username: "default", // needs Redis >= 6
  password: "yvKztdp9YLHAUyewD8mNaVYvSTAs6hTo",
  db: 0, // Defaults to 0
});
