#!/usr/bin/python3
""" FIFO caching """
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ Defines the FIFO cache class """

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.cache_keys = []

    def put(self, key, item):
        """ Add an item in the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                if key not in self.cache_data:
                    discard = self.cache_keys.pop(0)
                    del self.cache_data[discard]
                    print("DISCARD: {}".format(discard))
            self.cache_keys.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key """
        return self.cache_data.get(key, None)
