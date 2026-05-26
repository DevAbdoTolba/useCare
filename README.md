# useCare
medical project made by react and ~later will integrate django~ :)


## API

using mock data to fetch:
```js
{"_meta":{"today":"2026-05-18","description":"useCare mock DB. Paste into npoint.io to share with the team. Edit there to update the whole team's view at once.","schema_version":1},"users":[{"id":1,"name":"Sarah Admin","role":"admin","email":"admin@usecare.test","gender":"female","status":"approved","password":"admin123","description":null,"phone_number":"+20-100-000-0001","specialty_id":null,"date_of_birth":"1985-04-12"},{"id":2,"name":"Dr. Ahmed Tolba","role":"doctor","email":"ahmed@usecare.test","gender":"male","status":"approved","password":"doctor123","description":"8 yrs cardiology experience","phone_number":"+20-100-000-0002","specialty_id":1,"date_of_birth":"1986-09-03"},{"id":3,"name":"Dr. Samir Hassan","role":"doctor","email":"samir@usecare.test","gender":"male","status":"pending","password":"doctor123","description":"Pediatrician, fellowship at Cairo Univ.","phone_number":"+20-100-000-0003","specialty_id":2,"date_of_birth":"1990-01-22"},{"id":4,"name":"Dr. Mona El-Sayed","role":"doctor","email":"mona@usecare.test","gender":"female","status":"approved","password":"doctor123","description":"Dermatology specialist","phone_number":"+20-100-000-0004","specialty_id":3,"date_of_birth":"1988-07-15"},{"id":5,"name":"Dr. Karim Nasr","role":"doctor","email":"karim@usecare.test","gender":"male","status":"pending","password":"doctor123","description":"Neurology, stroke specialist","phone_number":"+20-100-000-0005","specialty_id":4,"date_of_birth":"1982-11-30"},{"id":6,"name":"Dr. Layla Farouk","role":"doctor","email":"layla@usecare.test","gender":"female","status":"approved","password":"doctor123","description":"Cardiologist, women's heart health focus","phone_number":"+20-100-000-0006","specialty_id":1,"date_of_birth":"1980-02-28"},{"id":7,"name":"Yara Mostafa","role":"patient","email":"yara@usecare.test","gender":"female","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0007","specialty_id":null,"date_of_birth":"1995-03-08"},{"id":8,"name":"Omar Hany","role":"patient","email":"omar@usecare.test","gender":"male","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0008","specialty_id":null,"date_of_birth":"1992-12-01"},{"id":9,"name":"Nour Adel","role":"patient","email":"nour@usecare.test","gender":"female","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0009","specialty_id":null,"date_of_birth":"2001-05-19"},{"id":10,"name":"Ali Mahmoud","role":"patient","email":"ali@usecare.test","gender":"male","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0010","specialty_id":null,"date_of_birth":"1978-08-25"},{"id":11,"name":"Hana Khaled","role":"patient","email":"hana@usecare.test","gender":"female","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0011","specialty_id":null,"date_of_birth":"1989-11-04"},{"id":12,"name":"Tarek Rashid","role":"patient","email":"tarek@usecare.test","gender":"male","status":"approved","password":"patient123","description":null,"phone_number":"+20-100-000-0012","specialty_id":null,"date_of_birth":"1975-06-17"}],"specialties":[{"id":1,"name":"Cardiology","description":"Heart and vascular system"},{"id":2,"name":"Pediatrics","description":"Care for infants and children"},{"id":3,"name":"Dermatology","description":"Skin, hair, nails"},{"id":4,"name":"Neurology","description":"Nervous system"}],"appointments":[{"id":1,"date":"2026-05-04","time":"09:00","notes":"Routine cardio check, all clear.","status":"completed","doctor_id":2,"patient_id":7},{"id":2,"date":"2026-05-06","time":"10:30","notes":"Prescribed mild statins.","status":"completed","doctor_id":2,"patient_id":10},{"id":3,"date":"2026-05-10","time":"14:00","notes":"Patient cancelled.","status":"cancelled","doctor_id":4,"patient_id":8},{"id":4,"date":"2026-05-12","time":"11:00","notes":"Eczema cream prescribed.","status":"completed","doctor_id":4,"patient_id":9},{"id":5,"date":"2026-05-15","time":"16:00","notes":"Follow-up in 6 weeks.","status":"completed","doctor_id":6,"patient_id":11},{"id":6,"date":"2026-05-18","time":"10:00","notes":"","status":"confirmed","doctor_id":2,"patient_id":7},{"id":7,"date":"2026-05-18","time":"15:30","notes":"","status":"confirmed","doctor_id":6,"patient_id":12},{"id":8,"date":"2026-05-19","time":"09:30","notes":"","status":"confirmed","doctor_id":4,"patient_id":8},{"id":9,"date":"2026-05-20","time":"11:00","notes":"","status":"pending","doctor_id":2,"patient_id":9},{"id":10,"date":"2026-05-21","time":"14:00","notes":"","status":"confirmed","doctor_id":6,"patient_id":10},{"id":11,"date":"2026-05-22","time":"16:30","notes":"","status":"confirmed","doctor_id":2,"patient_id":7},{"id":12,"date":"2026-05-23","time":"10:00","notes":"","status":"pending","doctor_id":4,"patient_id":11},{"id":13,"date":"2026-05-25","time":"09:00","notes":"","status":"pending","doctor_id":2,"patient_id":12},{"id":14,"date":"2026-05-26","time":"13:00","notes":"","status":"confirmed","doctor_id":6,"patient_id":8},{"id":15,"date":"2026-05-28","time":"15:00","notes":"","status":"pending","doctor_id":4,"patient_id":9},{"id":16,"date":"2026-05-29","time":"11:30","notes":"","status":"pending","doctor_id":6,"patient_id":7},{"id":17,"date":"2026-06-01","time":"10:00","notes":"","status":"pending","doctor_id":2,"patient_id":10}],"availabilities":[{"id":1,"date":"2026-05-18","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":2,"date":"2026-05-20","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":3,"date":"2026-05-22","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":4,"date":"2026-05-25","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":5,"date":"2026-05-27","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":6,"date":"2026-05-29","end_time":"17:00","doctor_id":2,"start_time":"09:00","is_available":true},{"id":7,"date":"2026-05-19","end_time":"15:00","doctor_id":4,"start_time":"10:00","is_available":true},{"id":8,"date":"2026-05-21","end_time":"15:00","doctor_id":4,"start_time":"10:00","is_available":true},{"id":9,"date":"2026-05-26","end_time":"15:00","doctor_id":4,"start_time":"10:00","is_available":true},{"id":10,"date":"2026-05-28","end_time":"15:00","doctor_id":4,"start_time":"10:00","is_available":true},{"id":11,"date":"2026-05-18","end_time":"18:00","doctor_id":6,"start_time":"13:00","is_available":true},{"id":12,"date":"2026-05-20","end_time":"18:00","doctor_id":6,"start_time":"13:00","is_available":true},{"id":13,"date":"2026-05-22","end_time":"18:00","doctor_id":6,"start_time":"13:00","is_available":true},{"id":14,"date":"2026-05-25","end_time":"18:00","doctor_id":6,"start_time":"13:00","is_available":true}]}
```

## Docs

### Project [wire frame](https://raw.githubusercontent.com/DevAbdoTolba/useCare/refs/heads/main/docs/Untitled-2026-05-16-1800.svg)

<img width="3710" height="2026" alt="image" src="https://github.com/user-attachments/assets/b08db92a-11fd-44fe-b2a5-eace7ba6c0b7" />


### Projects [ERD](https://github.com/user-attachments/assets/6ca16691-4d6f-47dc-aea0-80fa9c6e42d3)


> Fields and entities tagged **(post-discussion)** were added after the
> lecturer review — see [`docs/useCare-erd.md`](./docs/useCare-erd.md) for the
> canonical version and notes.

```mermaid
erDiagram
    USER ||--o| DOCTOR : "is a (when U_role=doctor)"
    SPECIALTY ||--o{ DOCTOR : "has (N:1)"
    USER ||--o{ APPOINTMENTS : "books — patient (1:N)"
    DOCTOR ||--o{ APPOINTMENTS : "manages (1:N)"

    APPOINTMENTS ||--o| RATING : "rated after completion (1:0..1)"
    DOCTOR ||--o{ RATING : "receives (1:N)"
    USER ||--o{ RATING : "leaves — patient (1:N)"

    APPOINTMENTS ||--o| PAYMENT : "paid for (1:0..1)"
    USER ||--o{ PAYMENT : "pays — patient (1:N)"

    DOCTOR ||--o{ SPECIALTY_SUGGESTION : "proposes (1:N)"
    SPECIALTY_SUGGESTION }o--|| SPECIALTY : "becomes on approval"

    DOCTOR ||--o{ DOC_UPDATE_REQUEST : "requests (1:N)"

    USER {
        int U_id PK
        string U_name
        string U_role
        string U_email
        string U_password
        date U_DoB
        string U_gender
        string u_phone_number
        string U_Desc
        string U_status "post-discussion"
    }

    DOCTOR {
        int D_id PK_FK "post-discussion: = U_id (both PK and FK to User)"
        int specialty_id FK
        string D_resume_url "post-discussion: link or data URL"
        string D_license_url "post-discussion: link or data URL"
        float D_hourly_rate "post-discussion (USD)"
    }

    SPECIALTY {
        int S_id PK
        string S_name
        string S_desc
    }

    APPOINTMENTS {
        int A_id PK
        date A_date
        time A_time
        string A_notes
        string A_status
        boolean A_paid "post-discussion"
        float A_amount_paid "post-discussion (USD)"
        int patient_id FK
        int doctor_id FK
    }

    RATING {
        int appointment_id PK,FK
        int doctor_id FK
        int patient_id FK
        int stars "1..5"
        string comment "optional — why this rating"
    }

    PAYMENT {
        int id PK
        int appointment_id FK
        int patient_id FK
        int doctor_id FK
        float amount "USD"
        string status "paid / refunded"
        date date
    }

    SPECIALTY_SUGGESTION {
        int id PK
        string name "proposed specialty"
        string proposed_by "doctor email"
        string status "pending / approved / rejected"
    }

    DOC_UPDATE_REQUEST {
        int id PK
        int doctor_id FK
        string doctor_name "denormalised for the admin list"
        string resume_url "proposed — link or data URL (uploaded file)"
        string license_url "proposed — link or data URL (uploaded file)"
        string status "pending / approved / rejected"
    }
```

#### Relationships

| From | To | Verb | Cardinality |
|------|----|------|-------------|
| User | Doctor | ISA | every User with `role=doctor` has exactly one Doctor row; patient and admin users have none *(post-discussion: class-table inheritance — `D_id = U_id`)* |
| Doctor | Specialty | Has | many doctors → one specialty *(post-discussion: moved off User)* |
| User | Appointments | Book | one patient → many appointments |
| Doctor | Appointments | Manage | one doctor → many appointments *(post-discussion: moved off User)* |
| Appointments | Rating | Rated | each completed appointment → at most one rating *(post-discussion)* |
| Doctor | Rating | Receives | a doctor receives many ratings *(post-discussion)* |
| User | Rating | Leaves | a patient leaves many ratings *(post-discussion)* |
| Appointments | Payment | Paid for | each appointment → at most one payment *(post-discussion)* |
| User | Payment | Pays | one patient → many payments; platform keeps a 12% cut *(post-discussion)* |
| Doctor | SpecialtySuggestion | Proposes | a doctor proposes specialties the admin approves into Specialty *(post-discussion)* |
| Doctor | DocUpdateRequest | Requests | a doctor files résumé/license changes the admin approves back onto Doctor *(post-discussion)* |



## Team Members

- [@Ahmed Fathi](https://github.com/AhmeedFatehy)
- [@Abdo Tolba](https://github.com/DevAbdoTolba)
- [@Ahmed Samir](https://github.com/AhmedSamirKhalaf)
