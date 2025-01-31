```
classDiagram
    class Lecture {
        +String id
        +Professor professor
        +Int roomNumber
        +Int credits
        +Enum type
        +Boolean required
        +TimeList[] timeLists
        +Int maxCapacity
        +Int remainCapacity
        +increaseCapacity()
        +decreasePersonnel()
        +availableCapacity()
    }

    class TimeList {
        +Date startTime
        +Date endTime
        +Enum dayOfWeek
    }

    class User {
        +String id
    }

    class Professor {
        +String id
    }

    class Student {
        +String id
        +Int currentCredits
        -Map<string, Enrollment> enrollments
        +checkCredits()
        +increaseCredits()
        +decreaseCredits()
    }

    class Enrollment {
        +String id
        +Lecture lecture
        +Student student
        -Enum status
        +cancelStatus()
        +status()
    }

    Student --> "1 : 1" User
    Student "1" --o "n" Enrollment
    Professor --> "1 : 1"  User
    Professor "1" --> "n" Lecture
    Enrollment "1" --> "1" Lecture
    Lecture "1" --> "n" TimeList

```
