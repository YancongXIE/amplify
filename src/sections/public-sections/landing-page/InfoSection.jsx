import { ButtonMediumWide } from "../../../components/ui/Buttons";

export default function InfoSection() {
  return (
    <div>
      <div className="info-part  flex flex-col lg:flex-row-reverse items-center justify-center w-full">
        <div className="hero w-full h-full">
          <div className="hero-content flex-col lg:flex-row-reverse text-center justify-between lg:p-10">
            <img
              src="/assets/images/josh-withers-9h479w-syaQ-unsplash.jpg"
              className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-2xl object-cover sm:mt-6"
              alt="Beach Image"
            />
            <div className="lg:mr-10 sm:my-6">
              <p className="mb-4 text-light font-bold text-secondary">
                Opinion collection specialist
              </p>
              <h1 className="text-5xl font-bold text-secondary-content">
                Combining Q-Methodology and Delphi to capture opinion diversity
              </h1>
              <p className="py-6 text-secondary-content">
              Claros enables organisations to surface multiple coherent “schools of thought”, 
              track where convergence emerges, and produce actionable outputs that are both inclusive and analytically robust. 
              </p>
              <ButtonMediumWide className="text-white">Contact the research team</ButtonMediumWide>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
