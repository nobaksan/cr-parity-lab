import math


def mean(values):
    """
    Calculates the arithmetic mean of a list of numbers.

    Args:
        values: A list of numbers.

    Returns:
        The mean of the numbers.

    Raises:
        ValueError: If the input list is empty.
    """
    if not values:
        raise ValueError("빈 목록")
    return sum(values) / len(values)


def stddev(values):
    """
    Calculates the standard deviation of a list of numbers.

    Args:
        values: A list of numbers.

    Returns:
        The standard deviation of the numbers.
    """
    m = mean(values)
    return math.sqrt(sum((v - m) ** 2 for v in values) / len(values))


class Window:
    """
    A fixed-size sliding window that maintains a list of the most recently added items.
    """
    def __init__(self, size):
        """
        Initializes a new Window instance.

        Args:
            size: The maximum number of items the window can hold.
        """
        self.size = size
        self.items = []

    def push(self, value):
        """
        Adds a new value to the window, removing the oldest value if the window is full.

        Args:
            value: The value to add to the window.

        Returns:
            The mean of the current items in the window.
        """
        self.items.append(value)
        if len(self.items) > self.size:
            self.items.pop(0)
        return mean(self.items)
