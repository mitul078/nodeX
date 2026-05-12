# Nodex — API Testing Guide

Base URL: `http://localhost:4000`

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

Test in the order listed — each section depends on the previous one.

---

## 1. Auth Service

### Register
```
POST /api/v1/auth/register

Body:
{
    "username": "mitul_dev",
    "email":    "mitul@example.com",
    "password": "Password123"
}

Expected: 201
{
    "success": true,
    "message": "REGISTERED SUCCESSFULLY"
}
```

### Login
```
POST /api/v1/auth/signin

Body:
{
    "username": "mitul_dev",
    "password": "Password123"
}

Expected: 200
{
    "success": true,
    "message": "SIGNIN SUCCESSFUL",
    "data": {
        "accessToken": "eyJ...",
        "username":    "mitul_dev",
        "plan":        "free"
    }
}
```

Copy the `accessToken` — use it in all requests below.

### Refresh Token
```
POST /api/v1/auth/refresh

Cookie: refreshToken=<cookie_set_on_login>

Expected: 200
{
    "success": true,
    "data": {
        "accessToken": "eyJ..."
    }
}
```

---

## 2. User Service

### Get My Profile
```
GET /api/v1/users/profile/me

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "USER PROFILE",
    "data": {
        "userId":    "...",
        "username":  "mitul_dev",
        "email":     "mitul@example.com",
        "avatarUrl": "https://..."
    }
}
```

### Update Profile
```
PATCH /api/v1/users/profile/me

Headers: Authorization: Bearer <token>

Body:
{
    "fullName": "Mitul Jodhani",
    "bio":      "Backend developer"
}

Expected: 200
{
    "success": true,
    "message": "PROFILE UPDATED"
}
```

### See Someone's Profile
```
GET /api/v1/users/profile/:username

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "PROFILE",
    "data": {
        "username":  "...",
        "fullName":  "...",
        "avatarUrl": "..."
    }
}
```


## 3. Group Service

### Create Group
```
POST /api/v1/groups

Headers: Authorization: Bearer <token>

Body:
{
    "name":        "Team Nodex",
    "description": "Our backend team",
    "type":        "private"
}

Expected: 201
{
    "success": true,
    "message": "GROUP CREATED",
    "data": {
        "groupId":   "...",
        "name":      "Team Nodex",
        "type":      "private",
        "createdBy": "...",
        "createdAt": "..."
    }
}
```

Copy the `groupId` — use it in all group requests below.

### Get My Groups
```
GET /api/v1/groups/my

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "GROUPS FETCHED",
    "data": [
        {
            "groupId": "...",
            "name":    "Team Nodex",
            "myRole":  "admin"
        }
    ]
}
```

### Get Group Details
```
GET /api/v1/groups/:groupId

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "data": {
        "groupId":     "...",
        "name":        "Team Nodex",
        "memberCount": 1,
        "myRole":      "admin"
    }
}
```

### Add Member
```
POST /api/v1/groups/:groupId/members

Headers: Authorization: Bearer <token>

Body:
{
    "userId": "<userId_of_person_to_add>"
}

Expected: 201
{
    "success": true,
    "message": "USER ADDED IN GROUP"
}
```

### Get Group Members
```
GET /api/v1/groups/:groupId/members

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "data": [
        {
            "userId":    "...",
            "username":  "mitul_dev",
            "role":      "admin",
            "avatarUrl": "...",
            "joinedAt":  "..."
        }
    ]
}
```

### Remove Member
```
DELETE /api/v1/groups/:groupId/members/:userId

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "MEMBER REMOVED"
}
```

### Delete Group
```
DELETE /api/v1/groups/:groupId

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "GROUP DELETED"
}
```

---

## 4. Media Service

### Upload File
```
POST /api/v1/media/:groupId/upload

Headers: Authorization: Bearer <token>

Body: form-data
    key:   file
    value: (select a file from your machine)

Expected: 201
{
    "success": true,
    "message": "FILE UPLOADED",
    "data": {
        "mediaId":    "...",
        "fileName":   "report.pdf",
        "fileUrl":    "https://...",
        "fileType":   "doc",
        "fileSize":   204800,
        "uploadedBy": "...",
        "uploadedAt": "..."
    }
}
```

### Get Group Media
```
GET /api/v1/media/:groupId

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "MEDIA FETCHED",
    "data": [
        {
            "mediaId":    "...",
            "fileName":   "report.pdf",
            "fileUrl":    "https://...",
            "fileType":   "doc",
            "uploadedBy": "..."
        }
    ]
}
```

### Delete File
```
DELETE /api/v1/media/:mediaId

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "message": "FILE DELETED"
}
```

---

## 5. Billing Service

### Get Current Plan
```
GET /api/v1/billing/my-plan

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "data": {
        "plan":      "free",
        "expiresAt": null
    }
}
```

### Create Payment Order
```
POST /api/v1/billing/create-order

Headers: Authorization: Bearer <token>

Body:
{
    "plan": "pro"
}

Expected: 201
{
    "success": true,
    "message": "ORDER CREATED",
    "data": {
        "clientSecret": "pi_..._secret_...",
        "amount":       29900,
        "currency":     "inr"
    }
}
```

Copy the `clientSecret` — extract the `paymentIntentId` (everything before `_secret_`).

### Confirm Payment (Stripe test only)
```
POST https://api.stripe.com/v1/payment_intents/:paymentIntentId/confirm

Headers: Authorization: Bearer <stripe_secret_key>

Body: x-www-form-urlencoded
    payment_method: pm_card_visa
    return_url:     http://localhost:4000
```

### Verify Payment
```
POST /api/v1/billing/verify-payment

Headers: Authorization: Bearer <token>

Body:
{
    "paymentIntentId": "pi_..."
}

Expected: 200
{
    "success": true,
    "message": "PAYMENT VERIFIED",
    "data": {
        "plan":      "pro",
        "expiresAt": "2026-06-07T..."
    }
}
```

### Get Transaction History
```
GET /api/v1/billing/transactions

Headers: Authorization: Bearer <token>

Expected: 200
{
    "success": true,
    "data": [
        {
            "orderId":   "pi_...",
            "amount":    299,
            "plan":      "pro",
            "status":    "success",
            "createdAt": "..."
        }
    ]
}
```

---

## 6. Plan Limit Testing

### Test Group Limit (Free = 3 groups)
```
Create 4 groups as a free user.
4th request should return:

403
{
    "success": false,
    "message": "MAXGROUPS LIMIT REACHED ON FREE PLAN",
    "current": 3,
    "limit":   3,
    "upgrade": true
}
```

### Test Member Limit (Free = 10 members)
```
Add 11 members to a group as a free user.
11th request should return:

403
{
    "success": false,
    "message": "MAXMEMBERS LIMIT REACHED ON FREE PLAN",
    "upgrade": true
}
```

### Test File Type Limit (Free = image + doc only)
```
Upload a .mp4 video file as a free user.
Should return:

403
{
    "success": false,
    "message": "VIDEO FILES NOT ALLOWED ON FREE PLAN",
    "upgrade": true
}
```

### Test File Size Limit (Free = 25MB)
```
Upload a file larger than 25MB as a free user.
Should return:

403
{
    "success": false,
    "message": "FILE SIZE EXCEEDS 25MB LIMIT ON FREE PLAN",
    "upgrade": true
}
```

---

## 7. Error Cases to Test

### Wrong password
```
POST /api/v1/auth/signin
{ "username": "mitul_dev", "password": "wrongpass" }

Expected: 400
{ "success": false, "message": "CREDENTIALS ARE WRONG" }
```

### Missing token
```
GET /api/v1/groups/my
(no Authorization header)

Expected: 401
{ "success": false, "message": "ACCESS TOKEN MISSING" }
```

### Access group you're not in
```
GET /api/v1/groups/<someone_elses_groupId>

Expected: 403
{ "success": false, "message": "USER IS NOT IN GROUP" }
```

### Upload to group you're not in
```
POST /api/v1/media/<someone_elses_groupId>/upload

Expected: 403
{ "success": false, "message": "YOU ARE NOT IN THIS GROUP" }
```

### Add non-existent user to group
```
POST /api/v1/groups/:groupId/members
{ "userId": "fake_user_id" }

Expected: 404
{ "success": false, "message": "USER NOT FOUND" }
```

---

## Postman Collection Setup

1. Create a new collection called `Nodex`
2. Add a collection variable `baseUrl` = `http://localhost:4000`
3. Add a collection variable `token` = (empty for now)
4. After login — set `token` variable to the `accessToken` value
5. All requests use `{{baseUrl}}` and `Bearer {{token}}`

This way you only update the token once and all requests use it automatically.
