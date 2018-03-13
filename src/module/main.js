import { l, app } from "lapp"
import { MyButtonView, actions as MyButtonAction } from "../component/button/button"

let state = {
    aa: -1,
    bb: -1,
    checked: true,
    data: [{ name: "11", href: "22" }, { name: "33", href: "44" }]
}

const actions = {
    log: (e) => {
        console.log(e.target.value);
        state.inputVal = e.target.value
        MyButtonAction.addCount()
    },
    handleClick: () => {
        state.data.push({ name: "77", href: "88" })
        BoxView.$update()
    },
    handleCheck: (e) => {
        state.checked = !state.checked
        console.log(state.checked)
        BoxView.$update()
    },
    compute: (data) => {
        let dd = []
        state.data.forEach((item, index) => {
            dd.push(<div class="title">
                {item.name}
            </div>)
        })
        return dd
    }
}

const BoxView = ({ props, children }) => (<ul style="list-style: none;">
    &yen;
    <li className="item" onClick={() => alert('hi!')}>item 1</li>
    <li className="item">
        <input type="checkbox" checked={state.checked} onChange={actions.handleCheck} />
        <input type="text" style="border:1px solid #f40000;" onInput={actions.log} />
        <p>{state.inputVal}</p>
    </li>
    <li onClick={actions.handleClick} forceUpdate={true}>text</li>
    <MyButtonView className="button">hello, button</MyButtonView>
    {actions.compute(state.data)}
</ul>
);

//main
console.time("render virtual DOM with FP")
app(document.querySelector("#app"), BoxView, MyButtonView)
console.timeEnd("render virtual DOM with FP")
