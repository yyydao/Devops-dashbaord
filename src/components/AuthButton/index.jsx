import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, message } from 'antd'
import { Link } from 'react-router-dom'

export default class AuthButton extends PureComponent {
    static defaultProps = {
        buttonType: 'primary',
        buttonText: '',
        hasAuth: true,
        to: '/'
    }
    static propTypes = {
        buttonText: PropTypes.string.isRequired,
        hasAuth: PropTypes.bool.isRequired,
        to: PropTypes.string.isRequired
    }
    showError = () => {
        message.error('该用户无此操作权限')
    }

    render () {
        const {hasAuth, buttonText, to, buttonType} = this.props
        if (hasAuth) {
            return <Button type={buttonType}><Link to={to}>{buttonText}</Link></Button>
        } else {
            return <Button type={buttonType} onClick={this.showError}>{buttonText}</Button>
        }
    }
};


