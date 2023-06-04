#include <stdio.h>
#include <stdint.h>
#include <string.h>

// Overloading is fine... the arg types get attached to symbols, anyway.
// Check using 'readelf' if you don't believe me.
int32_t sum(int32_t a, int32_t b)
{
  return a + b;
}

int32_t sum(int32_t a, int64_t b, int64_t c)
{
  return a + b + c;
}

typedef struct
{
  int p1 = 0;
  int p2 = 0;
} vars;

int main()
{
  // 'auto' all the way... I hate typing out types.
  auto a = 231;
  auto b = 537;
  auto c = 123;

  auto x = sum(a, b);
  auto y = sum(a, b, c);

  // I guess using 'new' is ok.
  auto vars_ptr = new vars;
  vars_ptr->p1 = 32;
  vars_ptr->p2 = 100;
  auto res = vars_ptr->p1 + vars_ptr->p2;

  auto str = "The number is: ";
  auto str2 = "And the second number is: ";
  auto str3 = "The number from the struct is: ";

  auto str_len_total = strlen(str) + strlen(str2) + strlen(str3);
  auto temp_str = new char[str_len_total + 1];

  sprintf(temp_str, "%s%s%s", str, str2, str3);
  printf("%s", temp_str);

  //strcpy(&temp_str[0],                          str);
  //strcpy(&temp_str[strlen(str)],                str2);
  //strcpy(&temp_str[strlen(str) + strlen(str2)], str3);

  printf("%s%d\n", str, x);
  printf("%s%d\n", str2, y);
  printf("%s%d\n", str3, res);

  //printf("%s\n", temp_str);

  return 0;
}
