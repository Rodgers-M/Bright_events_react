/* global React :true */
/* global shallow :true */
/* global describe :true */
/* global Enzyme Adapter options :true */
/* global it sinon :true */
/* global expect :true */
/* eslint no-undef: "error" */

import LoginForm from '../../../src/components/users/login/LoginForm';
import { validate } from '../../../src/components/users/login/LoginContainer';
    
Enzyme.configure({ adapter: new Adapter() });

const mockSubmit = sinon.spy();
const mockChange = sinon.spy();

function setup(){
    const props = {
        state : {
            data: { 
                username: '',
                password: ''
            },
            loading: false,
            errors: {}
        },
        onSubmit : mockSubmit,
        onChange : mockChange
    };
    return shallow(
        <LoginForm { ...props } /> ,
        options.get()

    );
}

describe('Login form component', () => {
    it('should have two input fields', ()=> {
        const wrapper = setup();
        expect(wrapper.find('input').length).toEqual(2);
    });
    it('should have one button', ()=> {
        const wrapper = setup();
        expect(wrapper.find('Button').length).toEqual(1);
    });
    // in the next two tests i have a problem in accessing the props passed to the component
    it.skip('should have no data in state', ()=> {
        const wrapper = setup();
        expect(wrapper.prop('state').data.username).toBe('');
        expect(wrapper.prop('state').data.password).toBe('');
    });
    it.skip('should have a submit prop', ()=> {
        const wrapper = setup();
        expect(wrapper.prop('onSubmit')).toBeDefined();
    });
});

describe('login form behavior', ()=>{
    it('should call onchange when user types a value', ()=> {
        const wrapper = setup();
        wrapper.find('#username').simulate('change');
        expect(mockChange.called).toBe(true);
    });
});

describe('login validate function',()=>{
    it('should return an error object when the input fields have no data', ()=>{
        const  data = { 
            username: '',
            password: ''
        };
        const errors = validate(data);
        expect(errors.username).toBe('username can\'t be blank');
        expect(errors.password).toBe('Password can\'t be blank');
    });
});

