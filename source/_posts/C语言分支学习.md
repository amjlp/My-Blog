---
title: C语言分支学习
date: 2026-10-21 14:06:00
description: 记录 C 语言 if-else、switch 分支语句的学习笔记
keywords: C语言, 分支语句, if-else, switch
categories:
  - 学习
tags:
  - C语言
  - 编程基础
cover: /img/posts/C-language-if-switch/cover.webp
top_img: /img/posts/C-language-if-switch/banner.webp
---

## 一、if 语句

### 1.1 基本形式

`if ()` 括号内是 if 语句的执行条件。只有括号内的条件为真，if 语句的主体才会执行；如果为假，主体部分不执行。

if 语句的**主体默认为紧跟其后的那一条语句**。如果想让主体包含多条语句，就用一对花括号 `{}` 把它们括起来——花括号内的内容无论有多少条语句，都属于 if 语句的主体，条件为真时整体执行一次。

### 1.2 else 与配对规则

if 还有一个好伙伴叫 `else`，用法大体相同，但有两点区别：

- **else 不能单独使用**，而 if 可以
- **else 必须有一个 if 与它配对**，配对规则是：**else 默认与离它最近的那个 if 配对**

### 1.3 示例：判断输入值与 5 的大小

```c
int main (void)
{
  int a = 0;
  scanf ("%d",&a);
  if (a>5)
   printf("%d比五大\n",a);
  else
   printf("%d小于等于五\n",a);
  return 0;
}
```

### 1.4 执行过程

程序先把整型变量 `a` 初始化为 0，然后等待用户输入。用户输入的值会覆盖 `a` 原来的 0，接着判断 if 的条件是否为真。

例如用户输入 8，8 明显大于 5，于是 if 的主体执行一次，打印「8比五大」；如果输入 3，则执行 else 的主体，打印「3小于等于5」。这就是 if 语句最基本的用法。

### 1.5 这里藏着一个 bug

上面示例里的 else 分支有一个明显的缺陷：**它无法区分「小于五」和「等于五」**，因为 else 只表示「条件不成立」，也就是「不大于 5」，把小于和等于混在了一起。

C 语言里有个解决办法：**在 else 中再套一个 if**。

### 1.6 改进版：else if

```c
int main (void)
{
  int a = 0;
  scanf ("%d",&a);
  if (a>5)
   printf("%d比五大\n",a);
  else if (a<5)
        printf("%d小于五\n",a);
       else
        printf("%d等于五\n",a);
  return 0;
}
```

修改后的版本把 else 隐含的条件细分成「小于 5」和「等于 5」两种情况，这样才能明确表达到底属于哪一种。

---

## 二、switch 语句

### 2.1 基本形式

`switch ()` 括号内通常是一个整型或字符型变量，语句主体是花括号 `{}` 里的内容。花括号里一般写若干个 `case`，**case 的数量和取值与变量的可能取值有关**——变量取什么值，就执行对应的那个 case。

### 2.2 break 与「穿透」

case 后面一般要写 `break` 作为分隔，否则会继续往下执行（也就是常说的「穿透」）。

但这个特性也可以**主动利用**：把需要执行相同命令的几个 case 归为一类，只在最后一个 case 后面写 break。

另外，如果有需要，可以在 switch 里加一个 `default`，用来处理「没有命中任何有效值」的情况。

### 2.3 示例：输入 1~5 并输出对应的中文

```c
int main (void)
{
  int a = 0;
  printf("请输入一到五的数\n");
  scanf ("%d",&a);
  switch(a)
  {
    case 1:
      printf("这是一\n");
      break;
    case 2:
      printf("这是二\n");
      break;
    case 3:
      printf("这是三\n");
      break;
    case 4:
      printf("这是四\n");
      break;
    case 5:
      printf("这是五\n");
      break;
    default:
      printf("请输入有效值\n");
      break;
  }
  return 0;
}
```

执行过程：先提示用户输入 1~5 的数；用户按要求输入后，程序判断是哪个数并打印对应结果；如果没有按要求输入，就执行 default 的指令，提醒用户输入有效数字。

### 2.4 利用穿透做分类

```c
int main (void)
{
  int a = 0;
  printf("请输入一到五的数\n");
  scanf ("%d",&a);
  switch(a)
  {
    case 1:
    case 2:
    case 3:
      printf("这个数属于一到三\n");
      break;
    case 4:
      printf("这是四\n");
      break;
    case 5:
      printf("这是五\n");
      break;
    default:
      printf("请输入有效值\n");
      break;
  }
  return 0;
}
```

把上面的程序稍作修改后：当用户输入 1~3 中的任意一个数时，都会打印「这个数属于一到三」；输入 4、5 以及其它情况时，与上一个示例相同。

---

## 三、逻辑运算符（以及容易混淆的关系运算符）

{% note warning %}
原文把 `==` 和 `!=` 也归到了「逻辑运算符」里，这里做了更正。
{% endnote %}

C 语言的**逻辑运算符只有三个**：

| 运算符 | 含义 | 示例 |
|---|---|---|
| `&&` | 并且（两边都为真才为真） | `a > 0 && b > 0` |
| `\|\|` | 或者（任意一边为真就为真） | `a == 1 \|\| a == 2` |
| `!` | 取反（真变假、假变真） | `!(a > 5)` |

而 `==`（等于）和 `!=`（不等于）属于**关系运算符**，作用是比较两个值，结果是 0 或 1，通常配合逻辑运算符一起用在 if 的条件里。

---

## 四、习题实战

### 题 1：三角形判定（得分 65）

**要求**：输入三个正整数作为边长，按下述规则输出。

1. 先判断能否构成三角形（任意两边之和大于第三边）
2. 能构成则输出类型：等边 / 等腰 / 普通
3. 再单独输出一行，判断是否为直角三角形

**我的作答**

```c
int main()
{
	int a = 0, b = 0, c = 0;
	printf("请输入三边长\n");
	scanf("%d%d%d", &a, &b, &c);
	if (a + b > c && a - b<c && b + c>a && a + c > b)
	{
		if (a == b || b == c || c == a)
		{
			if (a == b && b == c)
				printf("等边三角形\n");
			else
				printf("等腰三角形\n");

		}
		else
			printf("普通三角形\n");
		if (a * a + b * b == c * c || b * b + c * c == a * a || a * a + b * b == c * c)
			printf("这是直角三角形\n");
		else
			printf("不是直角三角形\n");
	}
	return 0;
}
```

**主要问题**

1. 不能构成三角形时，程序一声不吭（缺少 else 分支）
2. 直角判断里，第一个条件写了两遍（复制粘贴残留）
3. `a - b < c` 这个条件多余——它不算 bug，但暴露了对三角形判定条件的理解偏差

**修正版**

```c
int main()
{
	int a = 0, b = 0, c = 0;
	printf("请输入三边长\n");
	scanf("%d%d%d", &a, &b, &c);
	if (a + b > c && b + c>a && a + c > b)//删除a - b<c这个多余条件
	{
		if (a == b || b == c || c == a)
		{
			if (a == b && b == c)
				printf("等边三角形\n");
			else
				printf("等腰三角形\n");

		}
		else
			printf("普通三角形\n");
		if (a * a + b * b == c * c || b * b + c * c == a * a || a * a + c * c == b * b)//修改为正确条件
			printf("这是直角三角形\n");
		else
			printf("不是直角三角形\n");
	}
  else
     printf("数据错误无法构成三角形，请重新输入");//添加无法构成三角形的情况
	return 0;
}
```

### 题 2：成绩等级（得分 90）

**要求**：输入一个整数分数，输出等级。必须用 switch 实现，不能用 if 判等级。

| 分数 | 等级 |
|---|---|
| 90–100 | A |
| 80–89 | B |
| 70–79 | C |
| 60–69 | D |
| 0–59 | E |

**我的作答**

```c
int main()
{
	int score=0;
	printf("请输入数据\n");
	scanf("%d", &score);
	if (score > 100 || score < 0)
		printf("数据不合理\n");
	else
	switch (score / 10)
	{
	case 0:
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
		printf("等级为E");
		break;
	case 6:
		printf("等级为D");
		break;
	case 7:
		printf("等级为C");
		break;
	case 8:
		printf("等级为B");
		break;
	case 9:
	case 10:
		printf("等级为A");
		break;
	}
	return 0;
}
```

**主要问题**

所有 printf 都没有写 `\n`，输出会全部粘在一起。

**修正版**

```c
int main()
{
	int score=0;
	printf("请输入数据\n");
	scanf("%d", &score);
	if (score > 100 || score < 0)
		printf("数据不合理\n");
	else
	switch (score / 10)
	{
	case 0:
	case 1:
	case 2:
	case 3:
	case 4:
	case 5:
		printf("等级为E\n");
		break;
	case 6:
		printf("等级为D\n");
		break;
	case 7:
		printf("等级为C\n");
		break;
	case 8:
		printf("等级为B\n");
		break;
	case 9:
	case 10:
		printf("等级为A\n");
		break;
	}
	return 0;
}
```

### 题 3：四则运算计算器（得分 80）

**要求**：输入形如 `a op b` 的表达式（op 是 `+ - * / %` 之一），输出结果。

**我的作答**

```c
int main()
{
	int a = 0, b = 0;
	char op = 0;
	printf("请输入数据\n");
	scanf("%d %c %d", &a, &op, &b);
	switch (op)
	{
	case '+':
		printf("a+b=%d\n", a + b);
		break;
	case '-':
		printf("a-b=%d\n", a - b);
		break;
	case '*':
		printf("a*b=%d\n", a * b);
		break;
	case '/':
		if (b != 0)
			printf("a/b=%.2lf\n", (double)a / b);
		else
			printf("除数不能为零");
		break;
	case '%':
		if (b > 0)
		   printf("a对b取模为%d\n", a % b);
		else
		   printf("数据错误\n");
		break;
	default:
		printf("输入数据错误\n");
	}
  return 0;
}
```

**主要问题**

1. 取模的判断条件写错了——负数也是可以取模的
2. `printf("除数不能为零")` 又少写了 `\n`

**修正版**

```c
int main()
{
	int a = 0, b = 0;
	char op = 0;
	printf("请输入数据\n");
	scanf("%d %c %d", &a, &op, &b);
	switch (op)
	{
	case '+':
		printf("a+b=%d\n", a + b);
		break;
	case '-':
		printf("a-b=%d\n", a - b);
		break;
	case '*':
		printf("a*b=%d\n", a * b);
		break;
	case '/':
		if (b != 0)
			printf("a/b=%.2lf\n", (double)a / b);
		else
			printf("除数不能为零\n");//添加\n
		break;
	case '%':
		if (b != 0)
		   printf("a对b取模为%d\n", a % b);//修改取模条件
		else
		   printf("数据错误\n");
		break;
	default:
		printf("输入数据错误\n");
	}
  return 0;
}
```

### 题 4：三数排序（进阶）

**要求**：输入三个互不相同的整数，从小到大输出。不许用数组，不许用循环。

**我的作答**

```c
int main( )
{
	int a = 0, b = 0, c = 0, e = 0;
	printf("请输入数据\n");
	scanf("%d%d%d", &a, &b, &c);
	if (a>b)
	{
	  e = a;
		a = b;
		b = e;
	}
	if (b > c)
	{
		e = b;
		b = c;
		c = e;
	}
	if (a > b)
	{
		e = a;
		a = b;
		b = e;
	}
	printf("%d%d%d", a, b, c);
	return 0;
}
```

**主要问题**

输出时三个数字之间没有分隔，会粘成一个数，完全没法读。

**修正版**

```c
int main( )
{
	int a = 0, b = 0, c = 0, e = 0;
	printf("请输入数据\n");
	scanf("%d%d%d", &a, &b, &c);
	if (a>b)
	{
	  e = a;
		a = b;
		b = e;
	}
	if (b > c)
	{
		e = b;
		b = c;
		c = e;
	}
	if (a > b)
	{
		e = a;
		a = b;
		b = e;
	}
	printf("%d %d %d", a, b, c);	//数字之间用空格隔开
	return 0;
}
```

---

## 五、学习收获

这次学习了 if 和 switch 语句的用法。通过分支语句，程序可以根据用户输入的不同做出不同反应，在增加功能的同时也增加了与用户之间的交互感。

另外通过习题，我学会了用中间量交换两个数的值，从而实现三个数的排序，不用数组和循环也能完成。
