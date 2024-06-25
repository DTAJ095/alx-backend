#!/usr/bin/python3
""" LIFO Caching """
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ Defines LIFO cache class """
    
    def __init__(self):
        """ Initialize LIFO caching """
        super().__init__()
        self.cache_keys = []
    
    def put(self, key, item):
        """ Add item in the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discard = self.cache_keys.pop()
                del self.cache_data[discard]
                print("DISCARD: {}".format(discard))
            self.cache_keys.append(key)
            self.cache_data[key] = item
    
    def get(self, key):
        """ Get item by key """
        return self.cache_data.get(key, None)
