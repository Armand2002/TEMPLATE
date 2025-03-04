from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..models.user_model import User, Specialty, UserCreate, ProfessionalCreate, UserUpdate, ProfessionalUpdate
from typing import List, Optional, Dict, Any
import logging

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CRUD operations for User
def create_user(db: Session, user_data: UserCreate) -> User:
    """Crea un nuovo utente nel database."""
    try:
        new_user = User(
            email=user_data.email,
            name=user_data.name,
            surname=user_data.surname,
            user_type=user_data.user_type,
            gender=user_data.gender,
            birth_date=user_data.birth_date,
            phone=user_data.phone,
            address=user_data.address,
            city=user_data.city,
            postal_code=user_data.postal_code,
            country=user_data.country
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except IntegrityError:
        db.rollback()
        logger.error(f"Integrity error creating user with email {user_data.email}")
        raise ValueError(f"User with email {user_data.email} already exists")
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating user: {str(e)}")
        raise

def create_professional(db: Session, professional_data: ProfessionalCreate) -> User:
    """Crea un nuovo professionista nel database."""
    try:
        new_professional = User(
            email=professional_data.email,
            name=professional_data.name,
            surname=professional_data.surname,
            user_type="professional",
            gender=professional_data.gender,
            birth_date=professional_data.birth_date,
            phone=professional_data.phone,
            address=professional_data.address,
            city=professional_data.city,
            postal_code=professional_data.postal_code,
            country=professional_data.country,
            bio=professional_data.bio,
            experience_years=professional_data.experience_years,
            rating=0.0  # Rating iniziale
        )
        
        # Aggiungi le specialità se specificate
        if professional_data.specialties:
            for specialty_id in professional_data.specialties:
                specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
                if specialty:
                    new_professional.specialties.append(specialty)
        
        db.add(new_professional)
        db.commit()
        db.refresh(new_professional)
        return new_professional
    except IntegrityError:
        db.rollback()
        logger.error(f"Integrity error creating professional with email {professional_data.email}")
        raise ValueError(f"Professional with email {professional_data.email} already exists")
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating professional: {str(e)}")
        raise

def get_user(db: Session, user_id: int) -> Optional[User]:
    """Recupera un utente specifico dal database."""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Recupera un utente specifico dal database usando l'email."""
    return db.query(User).filter(User.email == email).first()

def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    user_type: Optional[str] = None
) -> List[User]:
    """Recupera un elenco di utenti dal database con filtri opzionali."""
    query = db.query(User)
    
    # Filtra per tipo di utente se specificato
    if user_type:
        query = query.filter(User.user_type == user_type)
    
    return query.offset(skip).limit(limit).all()

def get_professional(db: Session, professional_id: int) -> Optional[User]:
    """Recupera un professionista specifico dal database con le sue specialità."""
    return db.query(User).filter(
        User.id == professional_id,
        User.user_type == "professional"
    ).options(joinedload(User.specialties)).first()

def get_professionals(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    specialty: Optional[str] = None,
    location: Optional[str] = None,
    min_rating: Optional[float] = None
) -> List[User]:
    """Recupera un elenco di professionisti dal database con filtri opzionali."""
    query = db.query(User).filter(User.user_type == "professional")
    
    # Applica filtri opzionali
    if specialty:
        query = query.join(User.specialties).filter(Specialty.name.ilike(f"%{specialty}%"))
    
    if location:
        query = query.filter(User.city.ilike(f"%{location}%"))
    
    if min_rating is not None:
        query = query.filter(User.rating >= min_rating)
    
    return query.offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_data: UserUpdate) -> Optional[User]:
    """Aggiorna un utente esistente nel database."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return None
    
    # Aggiorna i campi specificati
    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    try:
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating user {user_id}: {str(e)}")
        raise

def update_professional(db: Session, professional_id: int, professional_data: ProfessionalUpdate) -> Optional[User]:
    """Aggiorna un professionista esistente nel database."""
    professional = db.query(User).filter(
        User.id == professional_id,
        User.user_type == "professional"
    ).first()
    
    if not professional:
        return None
    
    # Aggiorna i campi specificati
    for field, value in professional_data.dict(exclude_unset=True, exclude={"specialties"}).items():
        setattr(professional, field, value)
    
    # Aggiorna le specialità se specificate
    if professional_data.specialties is not None:
        professional.specialties = []
        for specialty_id in professional_data.specialties:
            specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
            if specialty:
                professional.specialties.append(specialty)
    
    try:
        db.commit()
        db.refresh(professional)
        return professional
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating professional {professional_id}: {str(e)}")
        raise

def delete_user(db: Session, user_id: int) -> bool:
    """Elimina un utente dal database."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return False
    
    try:
        db.delete(user)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        raise

def search_professionals(
    db: Session,
    filters: Dict[str, Any],
    skip: int = 0,
    limit: int = 100
) -> List[User]:
    """Ricerca professionisti in base a vari criteri."""
    query = db.query(User).filter(User.user_type == "professional")
    
    if "specialty" in filters and filters["specialty"]:
        query = query.join(User.specialties).filter(Specialty.name.ilike(f"%{filters['specialty']}%"))
    
    if "location" in filters and filters["location"]:
        query = query.filter(User.city.ilike(f"%{filters['location']}%"))
    
    if "min_rating" in filters and filters["min_rating"] is not None:
        query = query.filter(User.rating >= filters["min_rating"])
    
    if "gender" in filters and filters["gender"]:
        query = query.filter(User.gender == filters["gender"])
    
    return query.offset(skip).limit(limit).all()

# CRUD operations for Specialty
def create_specialty(db: Session, name: str, description: Optional[str] = None) -> Specialty:
    """Crea una nuova specialità nel database."""
    try:
        specialty = Specialty(name=name, description=description)
        db.add(specialty)
        db.commit()
        db.refresh(specialty)
        return specialty
    except IntegrityError:
        db.rollback()
        logger.error(f"Integrity error creating specialty {name}")
        raise ValueError(f"Specialty {name} already exists")
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating specialty: {str(e)}")
        raise

def get_specialty(db: Session, specialty_id: int) -> Optional[Specialty]:
    """Recupera una specialità specifica dal database."""
    return db.query(Specialty).filter(Specialty.id == specialty_id).first()

def get_specialty_by_name(db: Session, name: str) -> Optional[Specialty]:
    """Recupera una specialità specifica dal database usando il nome."""
    return db.query(Specialty).filter(Specialty.name == name).first()

def get_specialties(db: Session, skip: int = 0, limit: int = 100) -> List[Specialty]:
    """Recupera un elenco di specialità dal database."""
    return db.query(Specialty).offset(skip).limit(limit).all()

def update_specialty(db: Session, specialty_id: int, name: Optional[str] = None, description: Optional[str] = None) -> Optional[Specialty]:
    """Aggiorna una specialità esistente nel database."""
    specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
    
    if not specialty:
        return None
    
    if name is not None:
        specialty.name = name
    if description is not None:
        specialty.description = description
    
    try:
        db.commit()
        db.refresh(specialty)
        return specialty
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating specialty {specialty_id}: {str(e)}")
        raise

def delete_specialty(db: Session, specialty_id: int) -> bool:
    """Elimina una specialità dal database."""
    specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
    
    if not specialty:
        return False
    
    try:
        db.delete(specialty)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting specialty {specialty_id}: {str(e)}")
        raise