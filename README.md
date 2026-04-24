# Shipment Tracker - User Journey and User Manual

This document describes how users interact with Shipment Tracker in day-to-day operations.

## Scope

- Role 1: Admin
- Role 2: Warehouse Staff

## Role Snapshot

| Role | Primary Responsibility | Key Modules |
| --- | --- | --- |
| Admin | Configure system, manage users, monitor operations, handle exceptions | Dashboard, Users, Roles, Settings, Shipments, Reports |
| Warehouse Staff | Execute shipment movement updates and field operations | Shipments, Status Updates, Timeline, Notes |

## User Journey

### Admin Journey

1. Sign in with admin credentials.
2. Open the dashboard and review shipment health (pending, in transit, delivered, delayed).
3. Configure system data:
   - roles and permissions
   - users
   - app and login branding settings
4. Create or review shipments with complete details.
5. Monitor movement using search, filters, and shipment timelines.
6. Share public tracking links with stakeholders when required.
7. Manage exceptions (delay, damage, loss, wrong delivery, reassignment).
8. Close the cycle with verification and exports/reports.

### Warehouse Staff Journey

1. Sign in with warehouse credentials.
2. Open assigned or relevant shipments.
3. Receive shipment and verify package information.
4. Update operational checkpoint status (received, sorted, dispatched, in transit, delivered, failed).
5. Record handover details between hubs/teams.
6. Add notes for mismatches or incidents.
7. Escalate damaged/missing shipments to admin.
8. Mark delivery completion or failure with reason.

### Role Handoffs

1. Admin creates and assigns shipment -> Warehouse Staff executes physical flow updates.
2. Warehouse Staff flags issue -> Admin investigates and resolves/escalates.
3. Warehouse Staff marks completion -> Admin verifies and reports.

## User Manual

### Admin User Manual

#### 1. Login

1. Open the application URL.
2. Enter email and password.
3. Select **Sign In**.

#### 2. Manage Users

1. Go to **Users**.
2. Select **Add User**.
3. Enter name, email, role, and location.
4. Save and confirm the user appears in the list.

#### 3. Manage Roles

1. Go to **Roles**.
2. Create or update role definitions.
3. Assign permissions based on operational needs.
4. Map users to roles.

#### 4. Configure App and Login Settings

1. Go to **Settings**.
2. Update branding fields:
   - app name and subtitle
   - logo emoji or logo URL
   - primary, accent, and sidebar colors
   - login headline, login subtitle, and login tags
3. Save changes.
4. Verify the login page reflects updated branding.

#### 5. Create Shipment

1. Go to **Shipments** and select **Create**.
2. Enter required shipment details:
   - tracking ID
   - sender and recipient
   - origin and destination
   - category/item details
   - expected dates and operational metadata
3. Save shipment.
4. Share tracking details if needed.

#### 6. Monitor and Control Shipment Flow

1. Use search and filters on the shipment list.
2. Open shipment details to review timeline and latest status.
3. Update status directly when intervention is needed.
4. Export shipment data for reporting.

#### 7. Handle Exceptions

1. Open affected shipment record.
2. Add issue notes and set appropriate status.
3. Reassign or escalate to responsible staff.
4. Track issue until closure.

### Warehouse Staff User Manual

#### 1. Login

1. Open the application URL.
2. Enter warehouse credentials.
3. Select **Sign In**.

#### 2. Find and Open Shipment

1. Go to **Shipments**.
2. Search by tracking ID, sender, recipient, or location.
3. Open the shipment entry.

#### 3. Perform Status Updates

1. Set current operational status.
2. Add timestamped notes where relevant.
3. Save updates.

#### 4. Handle Handover

1. Verify shipment details before transfer.
2. Update status to handover/dispatched.
3. Record to-whom, where, and when information in notes.

#### 5. Complete Delivery

1. Mark shipment as delivered after confirmation.
2. If delivery fails, mark failed delivery and provide reason.
3. Inform admin for customer-facing follow-up if required.

#### 6. Escalate Issues

1. Flag damaged, missing, or incorrect shipment immediately.
2. Add clear incident details in notes.
3. Notify admin for next action.

## Access Matrix (Quick Reference)

- Admin: Full access to users, roles, settings, shipments, and reporting.
- Warehouse Staff: Shipment operations and updates only (no system configuration access).

## Notes

- Keep status updates timely to maintain accurate live tracking.
- Use clear incident notes to reduce resolution time.
