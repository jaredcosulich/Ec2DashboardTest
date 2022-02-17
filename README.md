TWButton is a very simple button that uses Tailwind CSS for styling.

It uses [classMapMerge](/component/classMapMerge) to allow for existing Tailwind classnames to be overwritten.

All standard buttons props will work.

**Params**

* classMap: the classmap of styles    
* any param that works on a \<button/>

Default classMap
```
  {
    fontColor: 'text-white',
    background: 'bg-green-500',
    padding: 'px-3 py-1'
  }
```

**Examples**

```
<TWButton
  classMap={{
    background: 'bg-red-500',
    border: 'rounded-full'
  }}
>
```