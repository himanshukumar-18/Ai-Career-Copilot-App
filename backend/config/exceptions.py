from config.exception_handler import custom_exception_handler
import traceback

print("=" * 80)
traceback.print_exc()
print("=" * 80)

__all__ = [
    "custom_exception_handler",
]
