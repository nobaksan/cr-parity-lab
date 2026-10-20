def undocumented(a):
    return a


def documented(a):
    """Return a."""
    return a


class Box:
    def method_undoc(self):
        return 1

    def method_doc(self):
        """Doc."""
        return 2


async def async_undoc():
    return 3
