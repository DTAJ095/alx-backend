#!/usr/bin/python3
""" MRU Caching """
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """ Defines MRU cache class """

    def __init__(self):
        """ Initialize MRU caching """
        super().__init__()
        self.cache_keys = []
    
    def put(self, key, item):
        """ Add item in the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                if key not in self.cache_data:
                    discard = self.cache_keys.pop()
                    del self.cache_data[discard]
                    print("DISCARD: {}".format(discard))
                else:
                    self.cache_keys.remove(key)
            self.cache_keys.append(key)
            self.cache_data[key] = item
    
    def get(self, key):
        """ Get item by key """
        if key in self.cache_data:
            self.cache_keys.remove(key)
            self.cache_keys.append(key)
            return self.cache_data.get(key, None)
        return None
