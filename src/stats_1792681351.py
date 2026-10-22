import math


def mean(values):
    if not values:
        raise ValueError("빈 목록")
    return sum(values) / len(values)


def stddev(values):
    m = mean(values)
    return math.sqrt(sum((v - m) ** 2 for v in values) / len(values))


class Window:
    def __init__(self, size):
        self.size = size
        self.items = []

    def push(self, value):
        self.items.append(value)
        if len(self.items) > self.size:
            self.items.pop(0)
        return mean(self.items)
