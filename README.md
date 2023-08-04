# favicon
Add counting corners and animations to browser titles
# use
```
const a = new WebTileService(option)
    ```
        option:{
            Background: string,
            Color: string,
            Type: 'scroll' | 'flicker',
            Time: number
        }
    ```
1. set title
    a.setTitle('test')
2. set number
    a.setNumber(1)
3. clear title
    a.clearTitle()
4. clear number
    a.clearNum()
```
