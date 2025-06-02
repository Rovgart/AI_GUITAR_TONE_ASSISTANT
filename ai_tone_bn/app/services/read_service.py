from app.models import Amp, ImpulseResponse
from django.core.exceptions import ObjectDoesNotExist
from typing import List, Optional

class ReadService:
    @staticmethod
    def get_amps_from_db(query: dict) -> List[Amp]:
        """
        Retrieve Amp objects from database based on query parameters.
        
        Args:
            query (dict): Dictionary of field-value pairs for filtering
            
        Returns:
            List[Amp]: List of Amp objects matching the query
            
        Raises:
            ValueError: If query is empty or invalid
        """
        if not query or not isinstance(query, dict):
            raise ValueError("Query must be a non-empty dictionary")
        
        try:
            return list(Amp.objects.filter(**query))
        except Exception as e:
            raise Exception(f"Database query failed: {str(e)}")
    
    @staticmethod
    def get_amp_by_id(amp_id: int) -> Optional[Amp]:
        """
        Retrieve a single Amp object by ID.
        
        Args:
            amp_id (int): The ID of the amp to retrieve
            
        Returns:
            Optional[Amp]: The Amp object if found, None otherwise
        """
        try:
            return Amp.objects.get(id=amp_id)
        except ObjectDoesNotExist:
            return None
        except Exception as e:
            raise Exception(f"Database query failed: {str(e)}")
    
    @staticmethod
    def search_amps(search_term: str, field: str = 'name') -> List[Amp]:
        """
        Search for Amp objects containing a search term in specified field.
        
        Args:
            search_term (str): The term to search for
            field (str): The field to search in (default: 'name')
            
        Returns:
            List[Amp]: List of Amp objects matching the search criteria
        """
        if not search_term.strip():
            return []
        
        filter_kwargs = {f"{field}__icontains": search_term}
        
        try:
            return list(Amp.objects.filter(**filter_kwargs))
        except Exception as e:
            raise Exception(f"Search query failed: {str(e)}")
    @staticmethod
    def search_irs(search_term:str, field:str = 'name')-> List[ImpulseResponse]:
        if not search_term.strip():
            return []
        filter_kwargs={f"{field}__icontains": search_term}
        try:
            return list(ImpulseResponse.objects.filter(**filter_kwargs))
        except Exception as e:
            raise Exception(f"Search query failed: {str(e)}")