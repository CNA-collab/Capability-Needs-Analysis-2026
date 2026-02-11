import csv

def get_category(designation):
    designation_lower = designation.lower()
    if 'scientist' in designation_lower or 'research' in designation_lower:
        return 'Technical'
    elif 'quality' in designation_lower or 'assurance' in designation_lower or 'inspectorate' in designation_lower:
        return 'Compliance'
    else:
        return 'Leadership'

def get_recommendations(category):
    if category == 'Leadership':
        return 'Public Sector Leadership', 'Overseas', 'PNG Institute of Public Administration'
    elif category == 'Technical':
        return 'Research Methods', 'Local', 'University of PNG'
    elif category == 'Compliance':
        return 'QA Compliance', 'Online', 'Auditor General Office'

# Read the input CSV
input_file = 'cleaned_lnd.csv'
output_file = 'training_recommendations.csv'

with open(input_file, 'r', newline='', encoding='utf-8') as infile, \
     open(output_file, 'w', newline='', encoding='utf-8') as outfile:

    reader = csv.reader(infile)
    fieldnames = ['Division', 'PositionNo', 'Grade', 'Designation', 'Occupant']
    output_fieldnames = fieldnames + ['Category', 'ProposedTrainingCourse', 'TrainingType', 'Institution']
    writer = csv.DictWriter(outfile, fieldnames=output_fieldnames)
    writer.writeheader()

    next(reader)  # Skip header

    for row in reader:
        if len(row) == 5:
            division = row[0]
            position_no = row[1]
            grade = row[2]
            designation = row[3]
            occupant = row[4]
        elif len(row) > 5:
            num_extra = len(row) - 5
            division = ','.join(row[:num_extra + 1])
            position_no = row[num_extra + 1]
            grade = row[num_extra + 2]
            designation = ','.join(row[num_extra + 3:-1]) if len(row) > num_extra + 4 else row[num_extra + 3]
            occupant = row[-1]
        else:
            continue  # Skip malformed rows

        category = get_category(designation)
        course, training_type, institution = get_recommendations(category)

        clean_row = {
            'Division': division,
            'PositionNo': position_no,
            'Grade': grade,
            'Designation': designation,
            'Occupant': occupant,
            'Category': category,
            'ProposedTrainingCourse': course,
            'TrainingType': training_type,
            'Institution': institution
        }

        writer.writerow(clean_row)

print("Training recommendations have been generated and saved to 'training_recommendations.csv'")
