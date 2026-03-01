# VIX System Sequence Diagrams

## 1. DONATION FLOW

```mermaid
sequenceDiagram
    participant D as Donor
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant PDF as PDF Generator

    D->>F: Submit donation form
    F->>B: POST /api/inhalers/donate
    B->>DB: Create inhaler record
    B->>B: Generate initial hash
    B->>PDF: Generate QR code + PDF
    PDF-->>B: Return printable sticker
    B-->>F: Return inhaler data + QR + PDF
    F-->>D: Display printable donation receipt
```

## 2. CLINIC VERIFICATION FLOW

```mermaid
sequenceDiagram
    participant C as Clinic Staff
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant QR as QR Scanner

    C->>F: Access verification module
    F->>QR: Scan inhaler QR code
    QR-->>F: Return QR content
    F->>B: POST /api/inhalers/scan (validate)
    B->>DB: Fetch inhaler record
    B->>B: Validate hash chain
    alt Hash Valid
        B->>B: Generate new hash
        B->>DB: Update status to VERIFIED/REJECTED
        B->>QR: Generate new QR code
        QR-->>B: Return updated QR
        B-->>F: Return success + new QR
        F-->>C: Display verification result
    else Hash Invalid
        B-->>F: Return validation error
        F-->>C: Display tampering alert
    end
```

## 3. ASHA PICKUP FLOW

```mermaid
sequenceDiagram
    participant A as ASHA Worker
    participant F as Frontend (Offline)
    participant S as Local Storage
    participant B as Backend (When Online)
    participant DB as Database

    A->>F: Scan QR at clinic
    F->>S: Check local storage
    alt Online Mode
        F->>B: POST /api/inhalers/scan
        B->>DB: Validate + Update
        B-->>F: Return confirmation
    else Offline Mode
        F->>S: Save offline event
        F-->>A: Display local confirmation
    end
    A->>A: Physically pickup inhaler
    F->>S: Log pickup event locally
```

## 4. ASHA DELIVERY FLOW

```mermaid
sequenceDiagram
    participant A as ASHA Worker
    participant F as Frontend
    participant GPS as GPS Module
    participant B as Backend
    participant DB as Database

    A->>F: Arrive at patient location
    F->>GPS: Capture GPS coordinates
    GPS-->>F: Return location data
    A->>F: Scan QR at patient site
    F->>B: POST /api/inhalers/scan
    Note over B: Event: DELIVERED
    B->>B: Validate hash chain
    B->>B: Generate new hash with GPS
    B->>DB: Update status + GPS data
    B-->>F: Return delivery confirmation
    F-->>A: Display success message
```

## 5. PATIENT MATCHING FLOW (AI COMPONENT)

```mermaid
sequenceDiagram
    participant P as Patient
    participant F as Frontend
    participant B as Backend
    participant AI as Urgency Engine
    participant DB as Database

    P->>F: Submit request form
    F->>B: POST /api/patients/request
    B->>AI: Calculate urgency factors
    AI->>AI: Apply scoring rules
    AI-->>B: Return score + explanation
    B->>DB: Store patient request
    B->>DB: Get all requests
    B->>AI: Sort by urgency score
    AI-->>B: Return sorted queue
    B-->>F: Return queue position + explanation
    F-->>P: Display urgency assessment
```

## 6. RECYCLING FLOW

```mermaid
sequenceDiagram
    participant R as Recycling Center
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    R->>F: Scan rejected inhaler QR
    F->>B: POST /api/inhalers/scan
    Note over B: Event: DISPOSED
    B->>B: Validate hash chain
    B->>B: Generate disposal hash
    B->>DB: Update status + lock record
    B-->>F: Return disposal confirmation
    F-->>R: Display permanent lock notification
```

## 7. OFFLINE SYNC FLOW

```mermaid
sequenceDiagram
    participant F as Frontend
    participant S as Local Storage
    participant B as Backend
    participant DB as Database

    F->>S: Save offline events
    loop Periodic Sync
        F->>F: Check online status
        alt Online
            F->>S: Get unsynced events
            loop For Each Event
                F->>B: POST /api/sync
                B->>DB: Process event
                B-->>F: Return success
                F->>S: Mark event as synced
            end
        else Offline
            F->>F: Wait for connectivity
        end
    end
```

## 8. HASH CHAIN VALIDATION

```mermaid
sequenceDiagram
    participant V as Validator
    participant H as HashChain Utility
    participant DB as Database

    V->>DB: Request inhaler record
    DB-->>V: Return hash_chain
    V->>H: Validate entire chain
    H->>H: Verify initial hash
    loop For Each Event
        H->>H: Validate hash link
    end
    alt All Valid
        H-->>V: Return true
    else Tampering Detected
        H-->>V: Return false
        V->>V: Trigger security alert
    end
```

## 9. SECURITY & ACCESS CONTROL

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant Auth as Auth System

    U->>F: Attempt action
    F->>Auth: Check user role
    Auth-->>F: Return role permissions
    alt Authorized
        F->>B: Execute action
        B-->>F: Return success
        F-->>U: Display result
    else Unauthorized
        Auth-->>F: Return access denied
        F-->>U: Display error message
    end
```

## Key Security Features:

1. **Tamper-Evident Logging**: Every state change generates cryptographically linked hash
2. **Offline-First Design**: ASHA workers can function without internet connectivity
3. **Deterministic AI**: Rule-based urgency scoring with full explainability
4. **Role-Based Access**: Clinic/ASHA/Recycling roles with specific permissions
5. **End-to-End Validation**: QR codes contain current hash for instant verification
6. **Immutable Audit Trail**: Hash chain ensures complete transaction history
7. **Conflict Resolution**: Latest valid hash wins in sync conflicts
8. **Exponential Backoff**: Robust retry mechanism for offline sync