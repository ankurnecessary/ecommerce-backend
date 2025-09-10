# Create a category

![category](./category.drawio.svg)

## API

### List parent categories

```yaml
url: /api/categories/parents
method: GET
response: 
[
  {
    id: jfd,
    category: 'Category'
  },
  ...
]
```

### Create a category in DB

```yaml
url: /api/categories
method: POST
data:
{
  parentId: null / actualId,
  category: 'Category1',
  thumbnail: Binary file data
}

validation:
1. If parentId is not null then thumbnail should be present.
2. category cannot be empty string.
```
