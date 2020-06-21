---
title: 'Thiết lập theme cho React app với Context API và sass'
date: '2020-05-07'
publish: true
---

## Dark mode >< Light mode

Ngày nay người người dùng dark mode, nhà nhà dùng dark mode, dark mode khắp mọi nơi.

Mình không phải fan của dark mode, nhưng không có nghĩa là mình có thể mặc kệ không đưa nó vào để người dùng thể tận hưởng sở thích của họ.

Có rất nhiều cách để đưa dark mode vào React app, ở bài viết này mình xin chọn cách sử dụng Context API và sass.

Mình không chắc đây là cách tốt nhất, hoặc có lẽ là cách tốt, nhưng chí ít hiện tại nó chạy được với dự án của mình mà không có vấn đề gì nảy sinh.

Trước khi vào bài thì bạn cần có một chút căn bản về [Context API](https://reactjs.org/docs/context.html) và [sass](https://sass-lang.com/).

Ngoài ra thì chúng ta sẽ sử dụng [Hook](https://reactjs.org/docs/hooks-intro.html) thay cho Class Component.

*OK chúng ta bắt đầu thôi*

## Context

Đầu tiên chúng ta tạo file chứa context.

```js
// themeContext.ts

import React from "react";

export enum Theme {
  light = "light",
  dark = "dark"
}

const ThemeContext = React.createContext({
  theme: Theme.light,
  setTheme: (theme: Theme) => {}
});

export default ThemeContext;
```

Nội dung file bao gồm biến `themes` chứa 2 định nghĩa theme: `light` và `dark`.

Sau đó export một context chứa giá trị `theme` cùng với hàm để thay đổi giá trị này. Giá trị `theme` có mặc định là `themes.light`.

## ContextProvider

Đưa theme context provider vào App, hoặc tại một root nào đó mà bạn muốn theme của chúng ta có ảnh hưởng tới toàn bộ cây phía dưới.

```js
// App.tsx

import React, { useState } from "react";
import Layout from "./layout/Layout";
import ThemeContext, { Theme } from "./themeContext";
import "./styles.scss";

export default function App() {
  /*
    this state is actually where the theme data is store
    we will then pass this state and it accompany function to ThemeContext
  */
  const [theme, setTheme] = useState(Theme.light);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

Như vậy, toàn bộ cây con của `Layout` sẽ có `theme` context sẵn sàng để sử dụng.


## Use Context

Sử dụng theme ở các Component

```js
// layout/Layout.tsx

import React, { useContext } from "react";
import cn from "classnames";
import ThemeContext from "../themeContext";
import ThemeButton from "./ThemeButton";
import "./Layout.scss"; // normal styles go here
import "./Layout.dark.scss"; // styles on dark mode go here

export default function Layout() {
  // useContext hook, we only get theme value
  const { theme } = useContext(ThemeContext);

  return (
    <div className={cn("container", theme)}>
      <div className="header">
        <h1>Hi</h1>
      </div>
      <div className="middle">
        <p>I'm Reactjs</p>
      </div>
      <ThemeButton />
    </div>
  );
}
```

Chúng ta truy cập giá trị của `theme` context bằng `useContext` hook, sau đó dùng giá trị này để làm className cho component.

Bạn thấy rằng Component này import 2 sass file: `Layout.scss` và `Layout.dark.scss`, kết hợp với `theme` className, cách chúng ta tổ chức style như sau:

* Tất cả style cần thiết và style light mặc định để vào `Layout.scss`
* Style cho dark mode để vào `Layout.scss`, với wrapper `.dark` bao toàn bộ.

Như vậy khi giá trị của `theme` context trở thành `dark`, các style cho dark mode sẽ được kích hoạt.

```scss
/* Layout.scss */

.container {
  /* all CSS that the page need for normal render */

  /* Solarize light scheme */
  background-color: #fdf6e3;
  color: #657b83
}
```

```scss
/* Layout.dark.scss */

.container.dark {
  /* Solarize dark scheme */
  background-color: #002b36;
  color: #839496;
}
```

Trong ví dụ này, `.container` sẽ thay đổi màu backgroud và màu chữ tùy vào theme.

Style trong ví dụ chỉ để cho bạn thấy ý tưởng của hướng làm này, dĩ nhiên app thật sự sẽ có style phức tạp hơn.


## Update Context 

Từ từ đã, làm thế nào để chúng ta đổi được theme ?

Hãy tạo một nút `ThemeButton` như sau

```js
// ThemeButton.tsx

import React, { useContext } from "react";
import ThemeContext, { Theme } from "../themeContext";

export default function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  const theOtherTheme = theme === Theme.dark ? Theme.light : Theme.dark;

  function handleToggleTheme() {
    setTheme(theOtherTheme);
  }

  return (
    <div className="theme-button">
      <button type="button" onClick={handleToggleTheme}>
        Switch {theOtherTheme} theme
      </button>
    </div>
  );
}
```

Sử dụng `useContext` giống như ở `Layout`, nhưng lần này chúng ta truy cập cả giá trị lẫn hàm điều khiển context.

Khi người dùng click vào Button, chúng ta dùng hàm điểu khiển để thay đổi theme hiện tại.

Bay giờ bạn có thể đặt `ThemeButton` ở nơi nào đó thuận tiện cho người dùng.

## More about Context

Hiểu thêm về context value/control function

Quay trở lại Context file một chút

```js
// themeContext.ts
.
.
.

const ThemeContext = React.createContext({
  theme: Theme.light,  // theme value
  setTheme: (theme: Theme) => {} // function to change theme
})

```

Khi export Context chúng ta trả về một Object có 2 thành viên, `theme` và `setTheme`.

`theme` là giá trị của context, bất cứ component nào bao bởi ContextProvider đều có thể truy suất giá trị này.

`setTheme` là hàm để điều khiển giá trị của context.

Và tại App.js, khi chúng ta khởi tạo ContextProvider

```js
// App.tsx
.
.
.
  const [theme, setTheme] = useState(themes.light);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
```

Ở đây chúng ta cung cấp 1 cặp state và setState hook vào cho context, như vậy bên dưới cây component, giá trị của context cùng với hàm điều khiển thực ra chính là cặp state, setState này.

Khi chúng ta gọi `setTheme`, context sẽ dùng setState tại App.js để thay đổi `theme` state, context sau đó cập nhật thay đổi tới các consumer.

## Demo

[CodeSandbox Demo](https://codesandbox.io/s/theme-switcher-with-react-context-z10hd)

## Kết

Vậy là xong, từ bây giờ khi tạo component mới, bạn chỉ cần tạo kèm 2 file sass, 1 cho light theme và 1 cho dark theme vào wrap bới `.dark` class.
Bất cứ component nào được sử dụng bên dưới `Layout` đều sẽ chịu ảnh hưởng của `.dark` class này, bạn không cần thiết phải truy cập tới theme context để xét giá trị của nó nữa.

Hi vọng cách làm này có thể giúp bạn có thêm kiến thức về context và cách thiết lập theme cho React app.