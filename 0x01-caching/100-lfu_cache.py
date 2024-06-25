#!/usr/bin/python3
""" LFU Caching """
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ Defines LFU cache class """

    def __init__(self):
        """ Initialize LFU caching """
        super().__init__()
        self.cache_keys = []
        self.cache_frequency = {}

    def put(self, key, item):
        """ Add item in the cache """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                if key not in self.cache_data:
                    discard = self.cache_keys.pop(0)
                    del self.cache_data[discard]
                    del self.cache_frequency[discard]
                    print("DISCARD: {}".format(discard))
                else:
                    self.cache_keys.remove(key)
                    del self.cache_frequency[key]
            self.cache_keys.append(key)
            self.cache_data[key] = item
            self.cache_frequency[key] = 0

    def get(self, key):
        """ Get item by key """
        if key in self.cache_data:
            self.cache_frequency[key] += 1
            self.cache_keys.remove(key)
            self.cache_keys.append(key)
            return self.cache_data.get(key, None)
        return None
