import  React, {Component} from 'react';
import  Validator from 'validator';
import {Form, Button } from 'semantic-ui-react';
import  PropTypes from 'prop-types';
import InLineError from '../messages/InLineError';

class LoginForm extends Component{
    state = {
        data: { 
            email: '',
            password: ''
        },
        loading: false,
        errors: {}
    };

    onChange = e => this.setState({
        data : {...this.state.data, [e.target.name]: e.target.value}
        });

    onSubmit = () => {
        const errors = this.validate(this.state.data);
        this.setState({ errors });
        if(Object.keys(errors).length===0){
            this.props.submit(this.state.data);
        }
    };

    validate=(data) => {
        const errors = {};
        if(!Validator.isEmail(data.email)) errors.email = 'Invalid email';
        if(Validator.isEmpty(data.password)) errors.password = 'Password can\'t be blank';
        return errors;
    }

    render(){
        const { data, errors } = this.state;
        return(
            <Form onSubmit={this.onSubmit}>
                <Form.Field error={!!errors.email}>
                    <label htmlFor='email' > Email </label>
                    <input type='email' name='email' id='email'
                        placeholder='example@example.com'
                        value={data.email}
                        onChange={this.onChange}
                    />
                {errors.email && <InLineError message={errors.email} /> }
                </Form.Field>
                <Form.Field error={!!errors.password}>
                    <label htmlFor='password' > password </label>
                    <input type='password' name='password' id='password'
                        placeholder='Password'
                        value={data.password}
                        onChange={this.onChange}
                    />
                {errors.password && <InLineError message={errors.password} /> }
                </Form.Field>
            <Button primary> Login </Button>
            </Form>
        );
    }
}

LoginForm.propTypes ={
    submit: PropTypes.func.isRequired
};

export default LoginForm;