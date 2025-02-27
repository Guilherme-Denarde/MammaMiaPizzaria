import { Component, OnInit, Inject } from '@angular/core'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlavorService } from 'src/app/middleware/services/flavor/flavor.service';
import { Flavor } from 'src/app/models/flavor/flavor';

@Component({
  selector: 'app-flavorlist',
  templateUrl: './flavorlist.component.html',
  styleUrls: ['./flavorlist.component.scss']
})
export class FlavorListComponent implements OnInit {  
  
  flavors: Flavor[] = [];
  isValidName = true;
  selectedFlavorForEdit: Flavor = new Flavor();

  constructor(private modalService: NgbModal, private flavorService: FlavorService) { }

  ngOnInit(): void {
    this.listAllFlavors();
  }

  listAllFlavors(): void {
    this.flavorService.getAll().subscribe(
      data => {
        this.flavors = data;
        this.flavors.sort((a, b) => b.id - a.id); 
        console.log(this.flavors);
      },
      error => {
        console.error('Error:', error);
        alert('An error occurred. Please check the console for more details.');
      }
    );
  }

  addFlavor(modal: any): void {
    this.selectedFlavorForEdit = new Flavor();
    this.modalService.open(modal, { size: 'sm' });
  }

  editFlavor(modal: any, flavor: Flavor, index: number): void {
    this.selectedFlavorForEdit = Object.assign({}, flavor);
    this.modalService.open(modal, { size: 'sm' });
  }

  saveOrUpdateFlavor(flavor: Flavor): void {
    if (!flavor.flavorName) {
      alert('Please insert valid data.');
      return;
    }

    const flavorObservable = flavor.id ? 
                             this.flavorService.update(flavor) : 
                             this.flavorService.create(flavor);

    flavorObservable.subscribe(
      responseFlavor => {
        const index = this.flavors.findIndex(f => f.id === responseFlavor.id);
        if (index !== -1) {
          this.flavors[index] = responseFlavor;
          alert('Flavor updated successfully!');
        } else {
          this.flavors.unshift(responseFlavor);
          alert('Flavor added successfully!');
        }
      },
      error => {
        const action = flavor.id ? "update" : "add";
        alert(`An error occurred while trying to ${action} the flavor.`);
        console.error(error);
      }
    );

    this.modalService.dismissAll();
  }

  deleteFlavor(flavor: Flavor): void {
    if (!flavor.id) { 
      console.error('Flavor ID is undefined or null. Cannot delete flavor.');
      alert('Error: Cannot delete flavor without a valid ID.');
      return;
    }

    if (confirm('Are you sure you want to delete this flavor?')) {
      this.flavorService.delete(flavor.id).subscribe(
        () => {
          const index = this.flavors.findIndex(f => f.id === flavor.id);
          if (index !== -1) {
            this.flavors.splice(index, 1);
          }
          alert('Flavor deleted successfully!');
        },
        error => {
          alert('An error occurred while trying to delete the flavor.');
          console.error(error);
        }
      );
    }
  }

  validateName(name: string): void {
    this.isValidName = !!name.trim(); 
  }
}
