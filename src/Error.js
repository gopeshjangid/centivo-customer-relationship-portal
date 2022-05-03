import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Error extends Component {
    state = {
        errorMessage: ''
    }
    static getDerivedStateFromError(error) {
        return { errorMessage: error.toString() }
    }

    reload = () => {
        window.location.reload()
    }
    render() {
        if (this.state.errorMessage) {
            return (
                <div className="overlay site-broke">
                    <div className="text-center site-broken vertical-center">
                        <h2 className="opps-something-went">
                            <span className="display-block text-center">Oops</span>{' '}
                            <span className="display-block block text-center">something went wrong</span>
                        </h2>
                        <Button
                            color="default button button-label rectangle"
                            onClick={this.reload}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

export default Error
