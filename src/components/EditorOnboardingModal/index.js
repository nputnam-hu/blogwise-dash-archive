import React, { Component } from 'react'
import { Dialog, Button } from '@blueprintjs/core'
import './styles.sass'

const ModalOne = ({ nextAction, isOpen }) => (
  <Dialog
    isOpen={isOpen}
    onClose={nextAction}
    className="editoronboarding__modal1"
  >
    <div className="editoronboarding__content">
      <h2>Welcome to the blogwise Editor!</h2>
      <span>
        You can use the editor to customize your blog and preview what it will
        look like to customers.
      </span>
      <Button large minimal rightIcon="arrow-right" onClick={nextAction}>
        Ok
      </Button>
    </div>
  </Dialog>
)

const ModalTwo = ({ nextAction, isOpen, onOpening, onClosing }) => (
  <Dialog
    isOpen={isOpen}
    onClose={nextAction}
    className="editoronboarding__modal2"
    onOpening={onOpening}
    onClosing={onClosing}
  >
    <div className="editoronboarding__content">
      <h3>Fill in Your Information</h3>
      <span>
        On the left side, you can fill in the information you want to display to
        your visitors. We've already fill in some bits based off your answers
        from last page.
      </span>
      <Button minimal rightIcon="arrow-right" onClick={nextAction}>
        Ok
      </Button>
    </div>
  </Dialog>
)

const ModalThree = ({ nextAction, isOpen, onOpening, onClosing }) => (
  <Dialog
    isOpen={isOpen}
    onClose={nextAction}
    className="editoronboarding__modal3"
    onOpening={onOpening}
    onClosing={onClosing}
  >
    <div className="editoronboarding__content">
      <h3>Preview Your Changes</h3>
      <span>
        On the right there is a preview of what your blog will look like. The
        preview will update in real time as you make changes.
      </span>
      <Button minimal rightIcon="arrow-right" onClick={nextAction}>
        Ok
      </Button>
    </div>
  </Dialog>
)

const ModalFour = ({ nextAction, isOpen, onOpening, onClosing }) => (
  <Dialog
    isOpen={isOpen}
    onClose={nextAction}
    className="editoronboarding__modal4"
    onOpening={onOpening}
    onClosing={onClosing}
  >
    <div className="editoronboarding__content">
      <h3>Save Your Changes</h3>
      <span>
        When you're done with editing the top, click this button to save your
        changes and proceed to the sidebar.
      </span>
      <Button minimal rightIcon="arrow-right" onClick={nextAction}>
        Ok
      </Button>
    </div>
  </Dialog>
)

class EditorOnboardingModal extends Component {
  constructor(props) {
    super(props)
    this.modals = [ModalOne, ModalTwo]
    this.state = {
      currentModal: 0,
    }
  }
  nextModal = i => () => this.setState({ currentModal: i + 1 })
  highLightElementById = id => ({
    onOpening: () => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth' })
      el.classList.add('showcase')
    },
    onClosing: () => {
      const el = document.getElementById(id)
      if (!el) return
      el.classList.remove('showcase')
    },
  })

  renderModals = () =>
    this.modals.map((Modal, i) => (
      <Modal
        nextAction={this.nextModal(i)}
        isOpen={this.state.currentModal === i}
      />
    ))
  render() {
    return (
      <>
        <ModalOne
          nextAction={this.nextModal(0)}
          isOpen={this.state.currentModal === 0}
        />
        <ModalTwo
          nextAction={this.nextModal(1)}
          isOpen={this.state.currentModal === 1}
          {...this.highLightElementById('editheader__inputs')}
        />
        <ModalThree
          nextAction={this.nextModal(2)}
          isOpen={this.state.currentModal === 2}
          {...this.highLightElementById('preview')}
        />
        {/* <ModalFour
          nextAction={this.nextModal(3)}
          isOpen={this.state.currentModal === 3}
          {...this.highLightElementById('editheader__button')}
        /> */}
      </>
    )
  }
}
export default EditorOnboardingModal
