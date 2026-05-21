# useCare — ER Diagram (Mermaid)

Generated from [`docs/useCare.drawio`](./useCare.drawio). Field names are kept
as they appear in the diagram (`U_*`, `S_*`, `A_*`). Foreign keys shown are
implied by the relationship lines (Has / Book / Manage).

```mermaid
erDiagram
    SPECIALTY ||--o{ USER : "has (N:1)"
    USER ||--o{ APPOINTMENTS : "books — patient (1:N)"
    USER ||--o{ APPOINTMENTS : "manages — doctor (1:N)"

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
        int S_id FK
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
        int patient_id FK
        int doctor_id FK
    }
```

## Relationships

| From | To | Verb | Cardinality |
|------|----|------|-------------|
| User | Specialty | Has | many users → one specialty (a doctor has one specialty) |
| User | Appointments | Book | one patient → many appointments |
| User | Appointments | Manage | one doctor → many appointments |
